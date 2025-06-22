// --- CHANGE 1: Import Formio instead of Form ---
import { Formio } from 'formiojs';

export interface WorkflowStep {
    id: string;
    title: string;
    form: any;
    completed: boolean;
    data?: any;
}

export interface WorkflowDefinition {
    id: string;
    title: string;
    description: string;
    steps: WorkflowStep[];
    currentStep: number;
}


export class FormioService {
    private workflows: Map<string, WorkflowDefinition> = new Map();

    constructor() {
        this.initializeSampleWorkflows();
    }

    private initializeSampleWorkflows(): void {
        const sampleWorkflow: WorkflowDefinition = {
            id: 'user-onboarding',
            title: 'User Onboarding Process',
            description: 'Complete guided setup for new users',
            currentStep: 0,
            steps: [
                {
                    id: 'personal-info',
                    title: 'Personal Information',
                    completed: false,
                    form: {
                        components: [
                            {
                                type: 'textfield',
                                key: 'firstName',
                                label: 'First Name',
                                placeholder: 'Enter your first name',
                                validate: { required: true }
                            },
                            {
                                type: 'textfield',
                                key: 'lastName',
                                label: 'Last Name',
                                placeholder: 'Enter your last name',
                                validate: { required: true }
                            },
                            {
                                type: 'email',
                                key: 'email',
                                label: 'Email Address',
                                placeholder: 'Enter your email',
                                validate: { required: true }
                            }
                        ]
                    }
                },
                {
                    id: 'preferences',
                    title: 'Preferences',
                    completed: false,
                    form: {
                        components: [
                            {
                                type: 'select',
                                key: 'department',
                                label: 'Department',
                                data: {
                                    values: [
                                        { label: 'Engineering', value: 'engineering' },
                                        { label: 'Marketing', value: 'marketing' },
                                        { label: 'Sales', value: 'sales' },
                                        { label: 'HR', value: 'hr' }
                                    ]
                                },
                                validate: { required: true }
                            },
                            {
                                type: 'radio',
                                key: 'experience',
                                label: 'Experience Level',
                                values: [
                                    { label: 'Beginner', value: 'beginner' },
                                    { label: 'Intermediate', value: 'intermediate' },
                                    { label: 'Advanced', value: 'advanced' }
                                ],
                                validate: { required: true }
                            }
                        ]
                    }
                },
                {
                    id: 'review',
                    title: 'Review & Submit',
                    completed: false,
                    form: {
                        components: [
                            {
                                type: 'htmlelement',
                                key: 'reviewText',
                                tag: 'div',
                                content: '<p>Please review your information before submitting:</p>'
                            },
                            {
                                type: 'checkbox',
                                key: 'confirmation',
                                label: 'I confirm that all information is correct',
                                validate: { required: true }
                            }
                        ]
                    }
                }
            ]
        };

        this.workflows.set(sampleWorkflow.id, sampleWorkflow);
        console.log(this.workflows);
    }

    getWorkflow(workflowId: string): WorkflowDefinition | undefined {
        return this.workflows.get(workflowId);
    }

    getAllWorkflows(): WorkflowDefinition[] {
        return Array.from(this.workflows.values());
    }

    async renderForm(container: HTMLElement, formDefinition: any, initialData: any = {}): Promise<any> {
        console.log('Creating form with definition:', formDefinition);

        // Step 1: Create the form without the initial data in the options.
        const form = await Formio.createForm(container, formDefinition, {
            buttonSettings: {
                showSubmit: false
            },
            noAlerts: true
        });

        // Step 2: Explicitly set the submission on the newly created form instance.
        // This is a more reliable method than passing it in the initial options.
        if (initialData && Object.keys(initialData).length > 0) {
            console.log('✅ Form created. Now setting submission data:', initialData);
            await form.setSubmission({
                data: initialData
            });
        }

        return form;
    }


    saveStepData(workflowId: string, stepId: string, data: any): void {
        const workflow = this.workflows.get(workflowId);
        if (workflow) {
            const step = workflow.steps.find(s => s.id === stepId);
            if (step) {
                // Deep clone the data to avoid reference issues
                step.data = JSON.parse(JSON.stringify(data));
                console.log('💾 Data saved for step:', stepId, 'Data:', step.data);
            }
        }
    }

    nextStep(workflowId: string): boolean {
        const workflow = this.workflows.get(workflowId);
        if (workflow && workflow.currentStep < workflow.steps.length - 1) {
            workflow.currentStep++;
            return true;
        }
        return false;
    }

    previousStep(workflowId: string): boolean {
        const workflow = this.workflows.get(workflowId);
        if (workflow && workflow.currentStep > 0) {
            workflow.currentStep--;
            return true;
        }
        return false;
    }

    isWorkflowComplete(workflowId: string): boolean {
        const workflow = this.workflows.get(workflowId);
        if (workflow) {
            return workflow.steps.every(step => step.completed);
        }
        return false;
    }

    getWorkflowProgress(workflowId: string): number {
        const workflow = this.workflows.get(workflowId);
        if (workflow) {
            const completedSteps = workflow.steps.filter(step => step.completed).length;
            return (completedSteps / workflow.steps.length) * 100;
        }
        return 0;
    }
}