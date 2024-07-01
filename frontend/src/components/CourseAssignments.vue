<template>
	<Button  v-if="user.data?.is_moderator" class="float-right mb-3" variant="solid" @click="openStudentModal()">
		<template #prefix>
			<Plus class="h-4 w-4" />
		</template>
		{{ __('Tambah Penugasan') }}
	</Button>
	<div class="text-lg font-semibold mb-4">
		{{ __('Penugasan') }}
	</div>
	<div v-if="students.data?.length">
		<ListView
			:columns="getStudentColumns()"
			:rows="students.data"
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
			<ListHeader
				class="mb-2 grid items-center space-x-4 rounded bg-gray-100 p-2"
			>
				<ListHeaderItem :item="item" v-for="item in getStudentColumns()">
					<template #prefix="{ item }">
						<component
							v-if="item.icon"
							:is="item.icon"
							class="h-4 w-4 stroke-1.5 ml-4"
						/>
					</template>
				</ListHeaderItem>
			</ListHeader>
			<ListRows>
				<ListRow :row="row" v-for="row in students.data">
					<template #default="{ column, item }">
						<ListRowItem :item="row[column.key]" :align="column.align">
							<template #prefix>
								<div v-if="column.key == 'full_name'">
									<Avatar
										class="flex items-center"
										:image="row['user_image']"
										:label="item"
										size="sm"
									/>
								</div>
							</template>
							<div>
								{{ row[column.key] }}
							</div>
						</ListRowItem>
					</template>
				</ListRow>
			</ListRows>
			<ListSelectBanner>
				<template #actions="{ unselectAll, selections }">
					<div class="flex gap-2">
						<Button
							variant="ghost"
							@click="removeStudents(selections, unselectAll)"
						>
							<Trash2 class="h-4 w-4 stroke-1.5" />
						</Button>
					</div>
				</template>
			</ListSelectBanner>
		</ListView>
	</div>
	<div v-else class="text-sm italic text-gray-600">
		{{ __('Tidak Ada Penugasan') }}
	</div>
	<AssignmentModal
		:course="props.course"
		v-model="showStudentModal"
		v-model:reloadAssignments="students"
	/>
</template>
<script setup>
import {
	createResource,
	ListHeader,
	ListHeaderItem,
	ListSelectBanner,
	ListRow,
	ListRows,
	ListView,
	ListRowItem,
	Avatar,
	Button,
} from 'frappe-ui'
import { Trash2, Plus } from 'lucide-vue-next'
import { ref, inject } from 'vue'
import StudentModal from '@/components/Modals/StudentModal.vue'
import AssignmentModal from '@/components/Modals/AssignmentModal.vue'
const user = inject('$user')

const showStudentModal = ref(false)

const props = defineProps({
	course: {
		type: String,
		default: null,
	},
})

const students = createResource({
	url: 'lms.lms.utils.get_assignments',
	params: {
		course: props.course,
	},
	auto: true,
})
console.log(students)

// const students = createResource({
// 	url: 'lms.lms.utils.get_course_students',
// 	cache: ['students', props.course],
// 	params: {
// 		batch: props.course,
// 	},
// 	auto: true,
// })
const getStudentColumns= () => {
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

// const getStudentColumns = () => {
// 	return [
// 		{
// 			label: 'Nama',
// 			key: 'full_name',
// 			width: 2,
// 		},
// 		// {
// 		// 	label: 'Courses Done',
// 		// 	key: 'courses_completed',
// 		// 	align: 'center',
// 		// },
// 		{
// 			label: 'Penugasan Selesai',
// 			key: 'assessments_completed',
// 			align: 'center',
// 		},
// 		{
// 			label: 'Terakhir Aktif',
// 			key: 'last_active',
// 		},
// 	]
// }

const openStudentModal = () => {
	showStudentModal.value = true
}

// const removeStudent = createResource({
// 	url: 'frappe.client.delete',
// 	makeParams(values) {
// 		return {
// 			doctype: 'LMS Assessment',
// 			name: values.student,
// 		}
// 	},
// })

// const removeStudents = (selections, unselectAll) => {
// 	selections.forEach(async (student) => {
// 		removeStudent.submit({ student })
// 	})
// 	setTimeout(() => {
// 		students.reload()
// 		unselectAll()
// 	}, 500)
// }

const removeStudent = createResource({
	url: 'frappe.client.delete',
	makeParams(values) {
		return {
			doctype: 'LMS Assessment',
			name: values.student,
		}
	},
})

const removeStudents = async (selections, unselectAll) => {
	for (const student of selections) {
		let success = false
		while (!success) {
			try {
				await removeStudent.submit({ student })
				success = true
			} catch (error) {
				if (error.message.includes('TimestampMismatchError')) {
					// Tangani error dan coba lagi
					console.error('TimestampMismatchError terjadi, mencoba lagi...')
					// Lakukan refresh jika perlu
				} else {
					// Tangani error lainnya
					console.error('Error lainnya:', error)
					break
				}
			}
		}
	}
	setTimeout(() => {
		students.reload()
		unselectAll()
	}, 500)
}
</script>
