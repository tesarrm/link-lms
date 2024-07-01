<template>
	<Dialog
		v-model="show"
		:options="{
			title: __('Tambah Penugasan'),
			size: 'sm',
			actions: [
				{
					label: 'Tambah',
					variant: 'solid',
					onClick: (close) => addAssingment(close),
				},
			],
		}"
	>
		<template #body-content>
			<div class="flex flex-col gap-4">
				<div class="grid grid-cols-2 gap-2">
					<a :href="'/app/lms-assignment'">
						<Button class="w-full" @click="openStudentModal()">
							{{ __('Tambah Tugas') }}
						</Button>
					</a>
					<a :href="'/app/lms-quiz'">
						<Button class="w-full" @click="openStudentModal()">
							{{ __('Tambah Kuis') }}
						</Button>
					</a>
				</div>
				<div class="">
					<div class="mb-1.5 text-sm text-gray-600">
						{{ __('Tipe Penugasan') }}
					</div>
					<Link
						doctype="DocType"
						v-model="type"
						:filters="{ name: ['in',['LMS Quiz','LMS Assignment']] }"
					/>
				</div>
				<div class="">
					<div class="mb-1.5 text-sm text-gray-600">
						{{ __('Pilih Penugasan') }}
					</div>
					<Link
						:doctype="currentDoctype"
						v-model="assignment"
						:filters="{}"
					/>
				</div>
			</div>
		</template>
	</Dialog>
</template>
<script setup>
import { Dialog, createResource, Button } from 'frappe-ui'
import { ref, watch, computed } from 'vue'
import Link from '@/components/Controls/Link.vue'

const assignments = defineModel('reloadAssignments')
const type = ref()
const assignment= ref()
const show = defineModel()
import { createToast } from '@/utils/'


const props = defineProps({
	course: {
		type: String,
		default: null,
	},
})

const currentDoctype = computed(() => {
	switch (type.value) {
		case 'LMS Quiz':
			return 'LMS Quiz'
		case 'LMS Assignment':
			return 'LMS Assignment'
		default:
			return ''
	}
})

watch(type, (newType) => {
	assignment.value = ''
})

watch(show, (newShow) => {
	if (!newShow) {
		type.value = ''
		assignment.value = ''
	}
})

const assignmentResource = createResource({
	url: 'frappe.client.insert',
	makeParams(values) {
		return {
			doc: {
				doctype: 'LMS Assessment',
				parent: props.course,
				parenttype: 'LMS Course',
				parentfield: 'assignments',
				assessment_type: type.value,
				assessment_name: assignment.value,
			},
		}
	},
})

const addAssingment = (close) => {
	assignmentResource.submit(
		{},
		{
			validate() {
				if (!type) {
					return 'Tipe penugasan tidak boleh kosong'
				}
				if (!assignment) {
					return 'Penugasan tidak boleh kosong'
				}
			},
			onSuccess() {
				assignments.value.reload()
				close()
				type.value = null
				assignment.value = null
			},
			onError(err) {
				createToast({
					title: 'Error',
					text: err.messages?.[0] || err,
					icon: 'x',
					iconClasses: 'bg-red-600 text-white rounded-md p-px',
					position: 'top-center',
					timeout: 10,
				})
			},
		}
	)
}

// const studentResource = createResource({
// 	url: 'frappe.client.insert',
// 	makeParams(values) {
// 		return {
// 			doc: {
// 				doctype: 'Batch Student',
// 				parent: props.batch,
// 				parenttype: 'LMS Batch',
// 				parentfield: 'students',
// 				student: student.value,
// 			},
// 		}
// 	},
// })

// const addStudent = (close) => {
// 	studentResource.submit(
// 		{},
// 		{
// 			onSuccess() {
// 				students.value.reload()
// 				close()
// 				student.value = null
// 			},
// 		}
// 	)
// }
</script>
