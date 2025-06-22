import { IRouter } from '@aurelia/router';
import { FormioService, WorkflowDefinition } from '../../services/formio-service';
import { inject } from 'aurelia';

@inject(IRouter, FormioService)
export class Forms {
    workflows: WorkflowDefinition[] = [];

    constructor(
        private formioService: FormioService,
        private router: IRouter
    ) { }

    attached(): void {
        // this.loadWorkflows();
    }

    private loadWorkflows(): void {
        this.workflows = this.formioService.getAllWorkflows();
    }

    createNewForm(): void {
        // Implementation for creating new forms
        console.log('Creating new form...');
        // This would typically open a form builder interface
    }

    editWorkflow(workflow: WorkflowDefinition): void {
        console.log('Editing workflow:', workflow.title);
        // Implementation for editing workflows
    }

    startWorkflow(workflow: WorkflowDefinition): void {
        // Navigate to the workflow page
        this.router.load('/workflow');
    }

    importWorkflow(): void {
        console.log('Importing workflow...');
        // Implementation for importing workflow files
    }

    exportWorkflows(): void {
        console.log('Exporting workflows...');
        // Implementation for exporting workflows as JSON
        const dataStr = JSON.stringify(this.workflows, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'workflows.json';
        link.click();
    }

    duplicateWorkflow(): void {
        console.log('Duplicating workflow...');
        // Implementation for duplicating selected workflow
    }

    openFormBuilder(): void {
        console.log('Opening form builder...');
        // This would typically open the Form.io form builder
        // You could integrate with Form.io's form builder component here
    }
}