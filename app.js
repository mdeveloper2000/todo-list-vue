const { createApp, ref } = Vue
const { useToast } = primevue.usetoast
const { useConfirm } = primevue.useconfirm

const App = {
    
    setup() {
        const showNew = ref(false)
        const showEdit = ref(false)
        const hasErrors = ref(false)
        const hasEditErrors = ref(false)
        const tasks = ref([])
        const description = ref('')
        const description_edit = ref('')        
        const priority = ref('')
        const priority_edit = ref('')
        const priorities = ref(['LOW', 'MEDIUM', 'HIGH'])        
        const id = ref(0)
        const toast = useToast()        
        const confirm = useConfirm()

        return {
            showNew, showEdit, hasErrors, hasEditErrors, tasks, description, description_edit, priority, 
            priority_edit, priorities, id, toast, confirm
        }
    },
    components: {
        "p-button": primevue.button,
        "p-message": primevue.message,
        "p-dialog": primevue.dialog,
        "p-inputtext": primevue.inputtext,
        "p-column": primevue.column,
        "p-datatable": primevue.datatable,
        "p-toast": primevue.toast,
        "p-panel": primevue.panel,
        "p-dropdown": primevue.dropdown,
        "p-confirmdialog": primevue.confirmdialog
    },    
    methods: {
        save() {
            if(this.description.trim() === '' || this.priority.trim() === '') {
                this.hasErrors = true
            }
            else {
                const storage = localStorage.getItem("tasks")
                let index = 1
                if(storage !== null) {                    
                    index = JSON.parse(storage).length + 1
                }
                const task = {
                    id: index,
                    description: this.description,                    
                    priority: this.priority
                }
                this.tasks.push(task)
                localStorage.setItem("tasks", JSON.stringify(this.tasks))
                this.toast.add({ severity: "success", summary: "Message", detail: "Task was saved successfully", life: 3000 })
                this.clearNewFields()
            }
        },
        edit(id) {
            this.showEdit = true
            const taskEdit = this.tasks.find((task) => task.id === id)
            this.id = id
            this.description_edit = taskEdit.description
            this.priority_edit = taskEdit.priority
        },
        update() {
            if(this.description_edit.trim() === '' || this.priority_edit.trim() === '') {
                this.hasEditErrors = true
            }
            else {
                this.tasks.map(task => {
                    if(task.id === this.id) {
                        task.description = this.description_edit
                        task.priority = this.priority_edit
                        localStorage.setItem("tasks", JSON.stringify(this.tasks))
                        this.showEdit = false
                        this.toast.add({ severity: "info", summary: "Message", detail: "Task was updated successfully", life: 3000 })
                        this.clearEditFields()
                    }
                })
            }
        },
        clearNewFields() {
            this.description = ''
            this.priority = ''
            this.hasErrors = false
            this.showNew = false
        },
        clearEditFields() {
            this.id = 0
            this.description_edit = ''
            this.priority_edit = ''
            this.hasEditErrors = false
            this.showEdit = false
        },
        deleteRow(id) {
            this.confirm.require({
                message: 'Do you really want to delete this task?',
                header: 'Delete Task',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                rejectClass: 'p-button-secondary p-button-outlined',
                acceptClass: 'p-button-danger',
                accept: () => {
                    this.tasks = this.tasks.filter(task => task.id !== id)
                    localStorage.setItem("tasks", JSON.stringify(this.tasks))
                    this.toast.add({ severity: "error", summary: "Message", detail: "Task was deleted successfully", life: 3000 })
                }
            })
        }
    },
    mounted() {        
        const storage = localStorage.getItem("tasks")
        if(storage !== null) {
            this.tasks = JSON.parse(storage)
        }
    }
}

createApp(App)
    .use(primevue.config.default)
    .use(primevue.toastservice)
    .use(primevue.confirmationservice)
    .mount("#app")