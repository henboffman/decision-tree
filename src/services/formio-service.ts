// --- CHANGE 1: Import Formio instead of Form ---
import { Formio } from 'formiojs';
import { SampleWorkflows } from './sample-workflows';

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


        // Add all workflows to the map
        this.workflows.set(SampleWorkflows.userOnboardingWorkflow.id, SampleWorkflows.userOnboardingWorkflow);
        this.workflows.set(SampleWorkflows.performanceReviewWorkflow.id, SampleWorkflows.performanceReviewWorkflow);
        this.workflows.set(SampleWorkflows.supportTicketWorkflow.id, SampleWorkflows.supportTicketWorkflow);
        this.workflows.set(SampleWorkflows.projectProposalWorkflow.id, SampleWorkflows.projectProposalWorkflow);
        this.workflows.set(SampleWorkflows.eventRegistrationWorkflow.id, SampleWorkflows.eventRegistrationWorkflow);

        console.log('Initialized workflows:', Array.from(this.workflows.keys()));
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