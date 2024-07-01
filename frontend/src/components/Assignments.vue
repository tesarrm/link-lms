<template>
	<div>
		<Button class="float-right mb-3" variant="solid" @click="openStudentModal()">
			<template #prefix>
				<Plus class="h-4 w-4" />
			</template>
			{{ __('Tambah Penugasan') }}
		</Button>
		<div class="text-lg font-semibold mb-4">
			{{ __('Penugasan') }}
		</div>
		<div v-if="assessments.data?.length">
			<ListView
				:columns="getAssessmentColumns()"
				:rows="assessments.data"
				row-key="name"
				:options="{
					selectable: false,
					showTooltip: false,
					getRowRoute: (row) => {
						if (row.submission) {
							return {
								name: 'AssignmentSubmission',
								params: {
									assignmentName: row.assessment_name,
									submissionName: row.submission.name,
								},
							}
						} else {
							return {
								name: 'AssignmentSubmission',
								params: {
									assignmentName: row.assessment_name,
									submissionName: 'new',
								},
							}
						}
					},
				}"
			>
			</ListView>

		</div>
		<div v-else class="text-sm italic text-gray-600">
			{{ __('Tidak Ada Penugasan') }}
		</div>
	</div>
	<AssignmentModal
		:course="props.course"
		v-model="showStudentModal"
		v-model:reloadAssignments="assessments"
	/>
</template>
<script setup>
import { ListView, createResource, Button } from 'frappe-ui'
import { Trash2, Plus } from 'lucide-vue-next'
import { inject, ref } from 'vue'
import AssignmentModal from '@/components/Modals/AssignmentModal.vue'

const user = inject('$user')
const showStudentModal = ref(false)

const props = defineProps({
	course: {
		type: String,
		required: true,
	},
	rows: {
		type: Array,
	},
	columns: {
		type: Array,
	},
	options: {
		type: Object,
		default: () => ({
			selectable: true,
			totalCount: 0,
			rowCount: 0,
		}),
	},
})

const assessments = createResource({
	url: 'lms.lms.utils.get_assignments',
	params: {
		course: props.course,
	},
	auto: true,
})
console.log(assessments)

const getAssessmentColumns = () => {
	return [
		{
			label: 'Penugasan',
			key: 'title',
		},
		{
			label: 'Tipe',
			key: 'assessment_type',
		},
	]

	if (!user.data?.is_moderator) {
		columns.push({
			label: 'Status/Score',
			key: 'status',
			align: 'center',
		})
	}
	return columns
}

const openStudentModal = () => {
	showStudentModal.value = true
}
</script>
