import { WorkflowDefinition } from "./formio-service";

export class SampleWorkflows {
    static readonly userOnboardingWorkflow: WorkflowDefinition = {
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

    static readonly performanceReviewWorkflow: WorkflowDefinition = {
        id: 'performance-review',
        title: 'Employee Performance Review',
        description: 'Annual performance evaluation and goal setting',
        currentStep: 0,
        steps: [
            {
                id: 'self-assessment',
                title: 'Self Assessment',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'textarea',
                            key: 'accomplishments',
                            label: 'Key Accomplishments This Year',
                            placeholder: 'Describe your major achievements...',
                            rows: 4,
                            validate: { required: true, minLength: 50 }
                        },
                        {
                            type: 'textarea',
                            key: 'challenges',
                            label: 'Challenges Faced',
                            placeholder: 'What obstacles did you overcome?',
                            rows: 3,
                            validate: { required: true }
                        },
                        {
                            type: 'select',
                            key: 'overallRating',
                            label: 'Overall Self Rating',
                            data: {
                                values: [
                                    { label: 'Exceeds Expectations', value: 'exceeds' },
                                    { label: 'Meets Expectations', value: 'meets' },
                                    { label: 'Below Expectations', value: 'below' }
                                ]
                            },
                            validate: { required: true }
                        }
                    ]
                }
            },
            {
                id: 'goals-development',
                title: 'Goals & Development',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'datagrid',
                            key: 'goals',
                            label: 'Goals for Next Year',
                            validate: { required: true },
                            components: [
                                {
                                    type: 'textfield',
                                    key: 'goal',
                                    label: 'Goal Description',
                                    validate: { required: true }
                                },
                                {
                                    type: 'select',
                                    key: 'priority',
                                    label: 'Priority',
                                    data: {
                                        values: [
                                            { label: 'High', value: 'high' },
                                            { label: 'Medium', value: 'medium' },
                                            { label: 'Low', value: 'low' }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            type: 'selectboxes',
                            key: 'developmentAreas',
                            label: 'Development Areas of Interest',
                            values: [
                                { label: 'Leadership Skills', value: 'leadership' },
                                { label: 'Technical Skills', value: 'technical' },
                                { label: 'Communication', value: 'communication' },
                                { label: 'Project Management', value: 'project_mgmt' },
                                { label: 'Industry Knowledge', value: 'industry' }
                            ]
                        }
                    ]
                }
            },
            {
                id: 'manager-feedback',
                title: 'Manager Feedback',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'htmlelement',
                            key: 'feedbackNote',
                            tag: 'div',
                            content: '<div class="alert alert-info">This section will be completed by your manager.</div>'
                        },
                        {
                            type: 'textarea',
                            key: 'managerComments',
                            label: 'Manager Comments',
                            placeholder: 'Manager feedback and observations...',
                            rows: 4
                        },
                        {
                            type: 'checkbox',
                            key: 'employeeAcknowledgment',
                            label: 'I acknowledge receipt of this performance review',
                            validate: { required: true }
                        }
                    ]
                }
            }
        ]
    };

    static readonly supportTicketWorkflow: WorkflowDefinition = {
        id: 'support-ticket',
        title: 'Customer Support Request',
        description: 'Submit and track customer support issues',
        currentStep: 0,
        steps: [
            {
                id: 'issue-details',
                title: 'Issue Details',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'select',
                            key: 'issueType',
                            label: 'Issue Type',
                            data: {
                                values: [
                                    { label: 'Technical Problem', value: 'technical' },
                                    { label: 'Billing Question', value: 'billing' },
                                    { label: 'Feature Request', value: 'feature' },
                                    { label: 'Account Access', value: 'access' },
                                    { label: 'Other', value: 'other' }
                                ]
                            },
                            validate: { required: true }
                        },
                        {
                            type: 'select',
                            key: 'priority',
                            label: 'Priority Level',
                            data: {
                                values: [
                                    { label: 'Critical - System Down', value: 'critical' },
                                    { label: 'High - Major Impact', value: 'high' },
                                    { label: 'Medium - Some Impact', value: 'medium' },
                                    { label: 'Low - Minor Issue', value: 'low' }
                                ]
                            },
                            validate: { required: true }
                        },
                        {
                            type: 'textfield',
                            key: 'subject',
                            label: 'Subject',
                            placeholder: 'Brief description of the issue',
                            validate: { required: true, minLength: 10 }
                        },
                        {
                            type: 'textarea',
                            key: 'description',
                            label: 'Detailed Description',
                            placeholder: 'Please provide as much detail as possible...',
                            rows: 5,
                            validate: { required: true, minLength: 20 }
                        }
                    ]
                }
            },
            {
                id: 'environment-info',
                title: 'Environment Information',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'select',
                            key: 'browser',
                            label: 'Browser',
                            data: {
                                values: [
                                    { label: 'Chrome', value: 'chrome' },
                                    { label: 'Firefox', value: 'firefox' },
                                    { label: 'Safari', value: 'safari' },
                                    { label: 'Edge', value: 'edge' },
                                    { label: 'Other', value: 'other' }
                                ]
                            }
                        },
                        {
                            type: 'select',
                            key: 'operatingSystem',
                            label: 'Operating System',
                            data: {
                                values: [
                                    { label: 'Windows', value: 'windows' },
                                    { label: 'macOS', value: 'macos' },
                                    { label: 'Linux', value: 'linux' },
                                    { label: 'iOS', value: 'ios' },
                                    { label: 'Android', value: 'android' }
                                ]
                            }
                        },
                        {
                            type: 'textarea',
                            key: 'stepsToReproduce',
                            label: 'Steps to Reproduce',
                            placeholder: '1. Go to...\n2. Click on...\n3. Expected vs Actual result',
                            rows: 4
                        },
                        {
                            type: 'file',
                            key: 'attachments',
                            label: 'Attachments',
                            multiple: true,
                            fileTypes: [
                                {
                                    label: 'Images',
                                    value: 'image/*'
                                },
                                {
                                    label: 'Documents',
                                    value: '.pdf,.doc,.docx,.txt'
                                }
                            ]
                        }
                    ]
                }
            },
            {
                id: 'contact-preferences',
                title: 'Contact Preferences',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'phoneNumber',
                            key: 'phoneNumber',
                            label: 'Phone Number (Optional)',
                            placeholder: '+1 (555) 123-4567'
                        },
                        {
                            type: 'radio',
                            key: 'preferredContact',
                            label: 'Preferred Contact Method',
                            values: [
                                { label: 'Email', value: 'email' },
                                { label: 'Phone', value: 'phone' },
                                { label: 'Either', value: 'either' }
                            ],
                            validate: { required: true }
                        },
                        {
                            type: 'select',
                            key: 'timezone',
                            label: 'Time Zone',
                            data: {
                                values: [
                                    { label: 'Eastern (EST/EDT)', value: 'eastern' },
                                    { label: 'Central (CST/CDT)', value: 'central' },
                                    { label: 'Mountain (MST/MDT)', value: 'mountain' },
                                    { label: 'Pacific (PST/PDT)', value: 'pacific' },
                                    { label: 'Other', value: 'other' }
                                ]
                            }
                        },
                        {
                            type: 'checkbox',
                            key: 'emailUpdates',
                            label: 'Send me email updates on ticket progress',
                            defaultValue: true
                        }
                    ]
                }
            }
        ]
    };

    static readonly projectProposalWorkflow: WorkflowDefinition = {
        id: 'project-proposal',
        title: 'Project Proposal Submission',
        description: 'Submit new project ideas for review and approval',
        currentStep: 0,
        steps: [
            {
                id: 'project-overview',
                title: 'Project Overview',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'textfield',
                            key: 'projectName',
                            label: 'Project Name',
                            placeholder: 'Enter project name',
                            validate: { required: true, minLength: 5 }
                        },
                        {
                            type: 'textarea',
                            key: 'projectDescription',
                            label: 'Project Description',
                            placeholder: 'Provide a detailed description of the project...',
                            rows: 4,
                            validate: { required: true, minLength: 100 }
                        },
                        {
                            type: 'textarea',
                            key: 'businessJustification',
                            label: 'Business Justification',
                            placeholder: 'Why is this project necessary? What problem does it solve?',
                            rows: 3,
                            validate: { required: true }
                        },
                        {
                            type: 'select',
                            key: 'projectCategory',
                            label: 'Project Category',
                            data: {
                                values: [
                                    { label: 'Technology Infrastructure', value: 'infrastructure' },
                                    { label: 'Product Development', value: 'product' },
                                    { label: 'Process Improvement', value: 'process' },
                                    { label: 'Customer Experience', value: 'customer' },
                                    { label: 'Cost Reduction', value: 'cost' },
                                    { label: 'Compliance/Regulatory', value: 'compliance' }
                                ]
                            },
                            validate: { required: true }
                        }
                    ]
                }
            },
            {
                id: 'timeline-budget',
                title: 'Timeline & Budget',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'datetime',
                            key: 'proposedStartDate',
                            label: 'Proposed Start Date',
                            format: 'yyyy-MM-dd',
                            enableDate: true,
                            enableTime: false,
                            validate: { required: true }
                        },
                        {
                            type: 'datetime',
                            key: 'proposedEndDate',
                            label: 'Proposed End Date',
                            format: 'yyyy-MM-dd',
                            enableDate: true,
                            enableTime: false,
                            validate: { required: true }
                        },
                        {
                            type: 'currency',
                            key: 'estimatedBudget',
                            label: 'Estimated Budget',
                            currency: 'USD',
                            validate: { required: true, min: 1000 }
                        },
                        {
                            type: 'datagrid',
                            key: 'milestones',
                            label: 'Key Milestones',
                            validate: { required: true },
                            components: [
                                {
                                    type: 'textfield',
                                    key: 'milestone',
                                    label: 'Milestone Description',
                                    validate: { required: true }
                                },
                                {
                                    type: 'datetime',
                                    key: 'dueDate',
                                    label: 'Due Date',
                                    format: 'yyyy-MM-dd',
                                    enableDate: true,
                                    enableTime: false
                                }
                            ]
                        }
                    ]
                }
            },
            {
                id: 'resources-risks',
                title: 'Resources & Risk Assessment',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'number',
                            key: 'teamSize',
                            label: 'Estimated Team Size',
                            placeholder: 'Number of team members needed',
                            validate: { required: true, min: 1 }
                        },
                        {
                            type: 'selectboxes',
                            key: 'requiredSkills',
                            label: 'Required Skills/Expertise',
                            values: [
                                { label: 'Frontend Development', value: 'frontend' },
                                { label: 'Backend Development', value: 'backend' },
                                { label: 'Database Administration', value: 'database' },
                                { label: 'UI/UX Design', value: 'design' },
                                { label: 'Project Management', value: 'pm' },
                                { label: 'Quality Assurance', value: 'qa' },
                                { label: 'DevOps', value: 'devops' },
                                { label: 'Data Analysis', value: 'data' }
                            ]
                        },
                        {
                            type: 'textarea',
                            key: 'risks',
                            label: 'Potential Risks',
                            placeholder: 'Identify potential risks and mitigation strategies...',
                            rows: 3,
                            validate: { required: true }
                        },
                        {
                            type: 'textarea',
                            key: 'successMetrics',
                            label: 'Success Metrics',
                            placeholder: 'How will success be measured?',
                            rows: 3,
                            validate: { required: true }
                        },
                        {
                            type: 'select',
                            key: 'priority',
                            label: 'Project Priority',
                            data: {
                                values: [
                                    { label: 'Critical - Must Have', value: 'critical' },
                                    { label: 'High - Important', value: 'high' },
                                    { label: 'Medium - Nice to Have', value: 'medium' },
                                    { label: 'Low - Future Consideration', value: 'low' }
                                ]
                            },
                            validate: { required: true }
                        }
                    ]
                }
            }
        ]
    };

    static readonly eventRegistrationWorkflow: WorkflowDefinition = {
        id: 'event-registration',
        title: 'Conference Registration',
        description: 'Register for the annual technology conference',
        currentStep: 0,
        steps: [
            {
                id: 'attendee-info',
                title: 'Attendee Information',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'textfield',
                            key: 'fullName',
                            label: 'Full Name',
                            placeholder: 'Enter your full name',
                            validate: { required: true }
                        },
                        {
                            type: 'textfield',
                            key: 'jobTitle',
                            label: 'Job Title',
                            placeholder: 'Your current position',
                            validate: { required: true }
                        },
                        {
                            type: 'textfield',
                            key: 'company',
                            label: 'Company/Organization',
                            placeholder: 'Where do you work?',
                            validate: { required: true }
                        },
                        {
                            type: 'email',
                            key: 'workEmail',
                            label: 'Work Email',
                            placeholder: 'your.email@company.com',
                            validate: { required: true }
                        },
                        {
                            type: 'phoneNumber',
                            key: 'mobile',
                            label: 'Mobile Phone',
                            placeholder: '+1 (555) 123-4567',
                            validate: { required: true }
                        }
                    ]
                }
            },
            {
                id: 'session-selection',
                title: 'Session Selection',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'radio',
                            key: 'registrationType',
                            label: 'Registration Type',
                            values: [
                                { label: 'Full Conference (2 days) - $299', value: 'full' },
                                { label: 'Day 1 Only - $199', value: 'day1' },
                                { label: 'Day 2 Only - $199', value: 'day2' },
                                { label: 'Virtual Attendance - $99', value: 'virtual' }
                            ],
                            validate: { required: true }
                        },
                        {
                            type: 'selectboxes',
                            key: 'sessionsDay1',
                            label: 'Day 1 Sessions (Select up to 3)',
                            conditional: {
                                show: true,
                                when: 'registrationType',
                                eq: 'full'
                            },
                            validate: { maxSelectedCount: 3 },
                            values: [
                                { label: 'AI & Machine Learning Trends', value: 'ai_ml' },
                                { label: 'Cloud Architecture Best Practices', value: 'cloud' },
                                { label: 'Cybersecurity in 2025', value: 'security' },
                                { label: 'DevOps Automation', value: 'devops' },
                                { label: 'Mobile Development Future', value: 'mobile' }
                            ]
                        },
                        {
                            type: 'selectboxes',
                            key: 'sessionsDay2',
                            label: 'Day 2 Sessions (Select up to 3)',
                            conditional: {
                                show: true,
                                when: 'registrationType',
                                eq: 'full'
                            },
                            validate: { maxSelectedCount: 3 },
                            values: [
                                { label: 'Leadership in Tech', value: 'leadership' },
                                { label: 'Sustainable Technology', value: 'sustainability' },
                                { label: 'Startup Pitch Competition', value: 'startup' },
                                { label: 'Networking Workshop', value: 'networking' },
                                { label: 'Career Development Panel', value: 'career' }
                            ]
                        },
                        {
                            type: 'selectboxes',
                            key: 'dietaryRestrictions',
                            label: 'Dietary Restrictions',
                            values: [
                                { label: 'Vegetarian', value: 'vegetarian' },
                                { label: 'Vegan', value: 'vegan' },
                                { label: 'Gluten-free', value: 'gluten_free' },
                                { label: 'Halal', value: 'halal' },
                                { label: 'Kosher', value: 'kosher' },
                                { label: 'No restrictions', value: 'none' }
                            ]
                        }
                    ]
                }
            },
            {
                id: 'payment-confirmation',
                title: 'Payment & Confirmation',
                completed: false,
                form: {
                    components: [
                        {
                            type: 'htmlelement',
                            key: 'paymentInfo',
                            tag: 'div',
                            content: '<div class="alert alert-info"><strong>Payment Information</strong><br>Your registration fee will be calculated based on your selections. Payment can be made via credit card or invoice.</div>'
                        },
                        {
                            type: 'radio',
                            key: 'paymentMethod',
                            label: 'Payment Method',
                            values: [
                                { label: 'Credit Card (immediate)', value: 'credit_card' },
                                { label: 'Invoice (NET 30)', value: 'invoice' },
                                { label: 'Company Purchase Order', value: 'po' }
                            ],
                            validate: { required: true }
                        },
                        {
                            type: 'textarea',
                            key: 'specialRequests',
                            label: 'Special Requests or Accommodations',
                            placeholder: 'Any accessibility needs, special requests, or additional information...',
                            rows: 3
                        },
                        {
                            type: 'checkbox',
                            key: 'marketingConsent',
                            label: 'I agree to receive future event notifications and updates'
                        },
                        {
                            type: 'checkbox',
                            key: 'termsAccepted',
                            label: 'I accept the terms and conditions of registration',
                            validate: { required: true }
                        }
                    ]
                }
            }
        ]
    };
}