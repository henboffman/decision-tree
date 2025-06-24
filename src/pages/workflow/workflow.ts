import { ILogger, inject } from 'aurelia';
import { FormioService, WorkflowDefinition, WorkflowStep } from '../../services/formio-service';
import { LocalStorageKeys } from "../../common/local-storage-keys";

@inject(FormioService, ILogger)
export class Workflow {
    private formContainer!: HTMLElement;
    private currentForm: any;
    private dataEntries: { [key: string]: any } = {};

    currentWorkflow!: WorkflowDefinition;
    currentStep!: WorkflowStep;
    isLoading: boolean = false;
    canProceed: boolean = false;
    isComplete: boolean = false;
    private _progressVersion: number = 0;
    private disableLocalStorageLoad: boolean = true; // Flag to disable local storage loading
    availableWorkflows: WorkflowDefinition[] = [];

    constructor(private formioService: FormioService, private logger: ILogger) {
    }

    // async attached(): Promise<void> {
    //     const workflow = this.formioService.getWorkflow('user-onboarding');
    //     if (!workflow) return;

    //     this.currentWorkflow = workflow;

    //     const lastModifiedWorkflowJson = localStorage.getItem(LocalStorageKeys.LAST_MODIFIED_WORKFLOW);
    //     if (lastModifiedWorkflowJson && !this.disableLocalStorageLoad) {
    //         const loadWorkflow = confirm('Do you want to load your saved progress?');
    //         if (loadWorkflow) {
    //             try {
    //                 const savedState = JSON.parse(lastModifiedWorkflowJson);
    //                 this.logger.info('Loading saved state from Local Storage:', savedState);

    //                 // Ensure the saved data is for the correct workflow
    //                 if (savedState.workflowId === this.currentWorkflow.id) {

    //                     // Restore the data for all steps
    //                     this.dataEntries = savedState.dataEntries || {};

    //                     // Restore the user's position in the workflow
    //                     this.currentWorkflow.currentStep = savedState.currentStep || 0;

    //                     // (Optional but good practice) Sync loaded data back to the service
    //                     Object.keys(this.dataEntries).forEach(stepId => {
    //                         this.formioService.saveStepData(
    //                             this.currentWorkflow.id,
    //                             stepId,
    //                             this.dataEntries[stepId]
    //                         );
    //                     });
    //                 }

    //             } catch (error) {
    //                 this.logger.error('Failed to parse or load saved workflow:', error);
    //                 localStorage.removeItem(LocalStorageKeys.LAST_MODIFIED_WORKFLOW);
    //             }
    //         }
    //     }

    //     await this.loadCurrentStep();
    // }

    async attached(): Promise<void> {
        // Fetch all workflows for the user to choose from
        this.availableWorkflows = this.formioService.getAllWorkflows();
        this.currentWorkflow = null; // Start with no workflow selected
    }

    async selectWorkflow(workflowId: string): Promise<void> {
        if (!workflowId) return;

        const workflow = this.formioService.getWorkflow(workflowId);
        if (!workflow) return;

        // Reset state for the newly selected workflow
        this.isComplete = false;
        this.dataEntries = {};
        this.currentWorkflow = workflow;

        // --- Logic moved from attached() ---
        const lastModifiedWorkflowJson = localStorage.getItem(LocalStorageKeys.LAST_MODIFIED_WORKFLOW);
        if (lastModifiedWorkflowJson && !this.disableLocalStorageLoad) {
            const loadWorkflow = confirm('Do you want to load your saved progress for this workflow?');
            if (loadWorkflow) {
                try {
                    const savedState = JSON.parse(lastModifiedWorkflowJson);
                    if (savedState.workflowId === this.currentWorkflow.id) {
                        this.logger.info('Loading saved state:', savedState);
                        this.dataEntries = savedState.dataEntries || {};
                        this.currentWorkflow.currentStep = savedState.currentStep || 0;
                        Object.keys(this.dataEntries).forEach(stepId => {
                            this.formioService.saveStepData(this.currentWorkflow.id, stepId, this.dataEntries[stepId]);
                        });
                    }
                } catch (error) {
                    this.logger.error('Failed to load saved workflow:', error);
                    localStorage.removeItem(LocalStorageKeys.LAST_MODIFIED_WORKFLOW);
                }
            }
        }
        await this.loadCurrentStep();
    }

    changeWorkflow(): void {
        this.currentWorkflow = null;
        this.isComplete = false;
        if (this.currentForm) {
            this.currentForm.destroy();
            this.currentForm = null;
        }
    }

    detached(): void {
        if (this.currentForm) {
            this.currentForm.destroy();
        }
    }

    async loadCurrentStep(): Promise<void> {
        this.isLoading = true;
        this.currentStep = this.currentWorkflow.steps[this.currentWorkflow.currentStep];

        try {
            if (this.currentForm) {
                this.currentForm.destroy();
            }
            this.formContainer.innerHTML = '';

            // Get the data for the current step from our dictionary.
            const existingDataForStep = this.dataEntries[this.currentStep.id] || {};
            console.log('Loading step with data:', existingDataForStep);

            // Pass this data to the service. Formio will handle the pre-population.
            this.currentForm = await this.formioService.renderForm(
                this.formContainer,
                this.currentStep.form,
                existingDataForStep // Pass the data here!
            );


            // No need for setSubmission anymore, as createForm handles it.
            // The validity check should still be performed.
            this.canProceed = this.currentForm.checkValidity(this.currentForm.submission.data, false);
            this._progressVersion++;
            await this.setupFormHandlers();

        } catch (error) {
            console.error('Error loading form:', error);
        } finally {
            this.isLoading = false;
        }
    }

    private calculateProgress(): void {
        if (!this.currentWorkflow || !this.currentWorkflow.steps.length) {
            this._progressVersion = 0;
            return;
        }
        console.log(this.currentWorkflow);
        // get the total number of questions in all steps. we get the count from the number of properties on each step.data object
        let totalQuestions = 0;
        this.currentWorkflow.steps.forEach(step => {
            const stepData = this.dataEntries[step.id] || {};
            const numQuestions = Object.keys(stepData).length;
            console.log(`Step "${step.id}" has ${numQuestions} questions.`);
            totalQuestions += numQuestions;
        });
        console.log(`Total answered questions across all steps: ${totalQuestions}`);
    }

    private async setupFormHandlers(): Promise<void> {
        if (!this.currentForm) return;

        this.currentForm.on('submitButton', (component: any) => {
            if (component.component.key === 'submit') {
                return false;
            }
        });

        // The simple 'change' event can still be used for general logs if needed
        this.currentForm.on('change', (submission: any) => {
            console.log('Simple Form changed event (for info, primary data capture via formio.change):', submission.data);
        });

        this.currentForm.events.onAny((eventName: string, changed: any) => {
            if (eventName === 'formio.change') {
                this.dataEntries[this.currentStep.id] = { ...changed.data };

                // this.calculateProgress();
                this.formioService.saveStepData(
                    this.currentWorkflow.id,
                    this.currentStep.id,
                    this.dataEntries[this.currentStep.id]
                );

                this.canProceed = changed.isValid;
                this._progressVersion++;

                this.saveCurrentWorkflow();
            }
        });

        console.log('🔍 Events setup complete');
    }

    private handleFormSubmit(data: any): void {
        console.log('Formio submit event triggered (if submit button clicked):', data);
    }

    async nextStep(): Promise<void> {
        // Data is continuously saved to dataEntries and formioService via 'formio.change'
        // No explicit saveCurrentStepData call needed here as it's handled in the event.

        let formIsValid = this.canProceed; // Use the latest validity from the formio.change event

        // If not valid, attempt to trigger submission to show errors
        if (!formIsValid) {
            try {
                await this.currentForm.triggerFormSubmit();
                formIsValid = true;
            } catch (submitError) {
                console.log('🚫 Programmatic submit failed, form is invalid:', submitError);
                formIsValid = false;
            }
        }

        if (!formIsValid) {
            console.log('Cannot proceed: Current step is invalid.');
            return;
        }

        this.currentStep.completed = true;
        this._progressVersion++;

        if (this.isLastStep) {
            this.completeWorkflow();
            return;
        }

        if (this.formioService.nextStep(this.currentWorkflow.id)) {
            await this.loadCurrentStep();
        }
    }

    async previousStep(): Promise<void> {
        // Data is continuously saved via 'formio.change'
        if (this.formioService.previousStep(this.currentWorkflow.id)) {
            await this.loadCurrentStep();
        }
    }

    async goToStep(stepIndex: number): Promise<void> {
        // Data is continuously saved via 'formio.change'
        if (stepIndex >= 0 && stepIndex < this.currentWorkflow.steps.length) {
            this.currentWorkflow.currentStep = stepIndex;
            await this.loadCurrentStep();
        }
    }

    // This method is now implicitly called by the formio.change event.
    // It's still here as a private helper for consistency but its role has changed.
    private saveCurrentStepData(): void {
        // This method is now just a wrapper for pushing data from dataEntries to the service.
        // It's called from formio.change event to keep formioService in sync.
        if (this.currentStep && this.dataEntries[this.currentStep.id]) {
            console.log(`💾 Pushing data for step "${this.currentStep.id}" from dictionary to service:`, this.dataEntries[this.currentStep.id]);
            this.formioService.saveStepData(
                this.currentWorkflow.id,
                this.currentStep.id,
                this.dataEntries[this.currentStep.id]
            );
        } else {
            console.warn('⚠️ Could not push data: currentStep or data in dictionary missing/invalid.');
        }
    }

    private completeWorkflow(): void {
        this.isComplete = true;
        console.log('Workflow completed with data:', this.getAllWorkflowData());
        // remove the last-updated-workflow from local storage
        localStorage.removeItem('last-modified-workflow');
    }

    private getAllWorkflowData(): any {
        const workflowData: any = {};
        this.currentWorkflow.steps.forEach(step => {
            if (this.dataEntries[step.id]) {
                Object.assign(workflowData, this.dataEntries[step.id]);
            }
        });
        return workflowData;
    }

    private exportAsJson(): void {
        // export the workflow data as JSON
        const workflowData = this.getAllWorkflowData();
        const dataStr = JSON.stringify(workflowData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `${this.currentWorkflow.title.replace(/\s+/g, '_')}_workflow_data.json`;
        link.click();
        console.log('Exported workflow data as JSON:', link.download);
    }

    saveCurrentWorkflow(): void {
        if (!this.currentWorkflow) return;

        // Create a comprehensive state object to save
        const workflowState = {
            workflowId: this.currentWorkflow.id,
            currentStep: this.currentWorkflow.currentStep,
            dataEntries: this.dataEntries
        };

        localStorage.setItem(LocalStorageKeys.LAST_MODIFIED_WORKFLOW, JSON.stringify(workflowState));
        // This console log will now show you the complete structure being saved
        console.log('💾 Workflow state saved to local storage:', workflowState);
    }

    startNewWorkflow(): void {
        // Reset workflow and clear dictionary
        this.currentWorkflow.currentStep = 0;
        this.currentWorkflow.steps.forEach(step => {
            step.completed = false;
            step.data = undefined; // Clear data in the service's workflow definition
        });
        this.dataEntries = {}; // Clear our dictionary

        this.isComplete = false;
        this.loadCurrentStep();
    }

    private exportCurrentWorkflow(): void {
        if (!this.currentWorkflow) return;
        // Create a comprehensive state object to export
        const workflowState = {
            workflowId: this.currentWorkflow.id,
            title: this.currentWorkflow.title,
            currentStep: this.currentWorkflow.currentStep,
            steps: this.currentWorkflow.steps.map(step => ({
                id: step.id,
                title: step.title,
                completed: step.completed,
                data: this.dataEntries[step.id] || {}
            }))
        };
        const dataStr = JSON.stringify(workflowState, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `${this.currentWorkflow.title.replace(/\s+/g, '_')}_workflow.json`;
        link.click();
        console.log('Exported current workflow as JSON:', link.download);
    }

    private exportCurrentWorkflowConfiguration(): void {
        if (!this.currentWorkflow) return;
        const workflowToExport = this.formioService.getWorkflow(this.currentWorkflow.id);
        if (!workflowToExport) {
            console.error('Workflow not found for export:', this.currentWorkflow.id);
            return;
        }
        const dataStr = JSON.stringify(workflowToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `${this.currentWorkflow.title.replace(/\s+/g, '_')}_workflow_configuration.json`;
        link.click();
        console.log('Exported current workflow configuration as JSON:', link.download);
    }


    // get progress(): number {
    //     const prog = this._progressVersion;

    //     if (!this.currentWorkflow || !this.currentWorkflow.steps.length) {
    //         return 0;
    //     }

    //     console.log(this.currentWorkflow);
    //     let totalQuestions = 0;
    //     let answeredQuestions = 0;
    //     this.currentWorkflow.steps.forEach(step => {
    //         const stepData = this.dataEntries[step.id] || {};
    //         // const numQuestions = Object.keys(stepData).length;
    //         const numQuestions = step.form.components.length;
    //         totalQuestions += numQuestions;
    //         for (const key in stepData) {
    //             if (Object.prototype.hasOwnProperty.call(stepData, key) && stepData[key] !== undefined && stepData[key] !== null && stepData[key] !== '') {
    //                 answeredQuestions++;
    //             }
    //         }
    //     });

    //     console.log(`Total answered questions: ${answeredQuestions} out of ${totalQuestions}`);

    //     const completedSteps = this.currentWorkflow.steps.filter(step => step.completed).length;
    //     // return Math.round((completedSteps / this.currentWorkflow.steps.length) * 100);
    //     return Math.round((answeredQuestions / totalQuestions) * 100);
    // }

    get progress(): number {
        if (!this.currentWorkflow || !this.currentWorkflow.steps.length) {
            return 0;
        }

        let totalQuestions = 0;
        let answeredQuestions = 0;
        console.log(this.currentWorkflow);

        this.currentWorkflow.steps.forEach(step => {
            const stepData = this.dataEntries[step.id] || {};

            // Recursively count all input components
            const inputComponents = this.getInputComponents(step.form.components);
            totalQuestions += inputComponents.length;

            // Count answered questions
            inputComponents.forEach(component => {
                console.log(component);
                if (this.isComponentAnswered(component.key, stepData)) {
                    answeredQuestions++;
                }
            });
        });

        console.log(`Total answered questions: ${answeredQuestions} out of ${totalQuestions}`);
        return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
    }

    /**
     * Recursively extracts all input components from a form structure
     */
    private getInputComponents(components: any[]): any[] {
        const inputComponents: any[] = [];

        // Component types that should be counted as questions
        const inputTypes = [
            'textfield', 'textarea', 'number', 'password', 'email', 'url', 'phoneNumber',
            'select', 'selectboxes', 'checkbox', 'radio', 'datetime', 'day', 'time',
            'currency', 'survey', 'signature', 'file', 'tags', 'address'
        ];

        components.forEach(component => {
            // Skip hidden components
            if (component.hidden) {
                return;
            }

            // If it's an input component, add it
            if (inputTypes.includes(component.type)) {
                inputComponents.push(component);
            }

            // Recursively check nested components
            if (component.components && Array.isArray(component.components)) {
                inputComponents.push(...this.getInputComponents(component.components));
            }

            // Handle special container types
            if (component.type === 'datagrid' && component.components) {
                inputComponents.push(...this.getInputComponents(component.components));
            }

            if (component.type === 'editgrid' && component.components) {
                inputComponents.push(...this.getInputComponents(component.components));
            }

            // Handle columns in layout components
            if (component.columns && Array.isArray(component.columns)) {
                component.columns.forEach(column => {
                    if (column.components) {
                        inputComponents.push(...this.getInputComponents(column.components));
                    }
                });
            }
        });

        return inputComponents;
    }

    /**
     * Determines if a component has been answered
     */
    private isComponentAnswered(key: string, stepData: any): boolean {
        const value = stepData[key];

        // Handle different types of "empty" values
        if (value === undefined || value === null) {
            return false;
        }

        // For strings, only consider truly empty strings as unanswered
        if (typeof value === 'string' && value.trim() === '') {
            return false;
        }

        // For arrays (multi-select, checkboxes), check if any items are selected
        if (Array.isArray(value) && value.length === 0) {
            return false;
        }

        // For objects (like selectboxes), check if any property is truthy
        if (typeof value === 'object' && !Array.isArray(value)) {
            return Object.values(value).some(v => !!v);
        }

        return true;
    }

    get isLastStep(): boolean {
        if (!this.currentWorkflow || !this.currentWorkflow.steps.length) {
            return false;
        }
        return this.currentWorkflow.currentStep === this.currentWorkflow.steps.length - 1;
    }

    get progressStyle(): string {
        return `width: ${this.progress}%;`;
    }
}