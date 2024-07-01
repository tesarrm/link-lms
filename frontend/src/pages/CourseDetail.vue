<template>
	<div v-if="course.data">
		<header
			class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-3 py-2.5 sm:px-5"
		>
			<Breadcrumbs class="h-7" :items="breadcrumbs" />
			<Button v-if="user.data?.is_moderator" @click="openAnnouncementModal()">
				<span>
					{{ __('Buat Pengumuman') }}
				</span>
				<template #suffix>
					<SendIcon class="h-4 stroke-1.5" />
				</template>
			</Button>
		</header>
		<div class="m-5">
			<div class="flex justify-between w-full">
				<div class="md:w-2/3">
					<div class="text-3xl font-semibold">
						{{ course.data.title }}
					</div>
					<div class="my-3 leading-6">
						{{ course.data.short_introduction }}
					</div>
					<div class="flex items-center">
						<!--<Tooltip
							v-if="course.data.avg_rating"
							:text="__('Average Rating')"
							class="flex items-center"
						>
							<Star class="h-5 w-5 text-gray-100 fill-orange-500" />
							<span class="ml-1">
								{{ course.data.avg_rating }}
							</span>
						</Tooltip>
						<span v-if="course.data.avg_rating" class="mx-3">&middot;</span>-->
						<Tooltip
							v-if="course.data.enrollment_count"
							:text="__('Enrolled Students')"
							class="flex items-center"
						>
							<Users class="h-4 w-4 text-gray-700" />
							<span class="ml-1">
								{{ course.data.enrollment_count_formatted }}
							</span>
						</Tooltip>
						<span v-if="course.data.enrollment_count" class="mx-3"
							>&middot;</span
						>
						<div class="flex items-center">
							<span
								class="h-6 mr-1"
								:class="{
									'avatar-group overlap': course.data.instructors.length > 1,
								}"
							>
								<UserAvatar
									v-for="instructor in course.data.instructors"
									:user="instructor"
								/>
							</span>
							<CourseInstructors :instructors="course.data.instructors" />
						</div>
					</div>
					<div class="flex mt-3 mb-4 w-fit">
						<Badge
							theme="gray"
							size="lg"
							class="mr-2"
							v-for="tag in course.data.tags"
						>
							{{ tag }}
						</Badge>
					</div>
					<CourseCardOverlay :course="course" class="md:hidden mb-4" />
					<div
						v-html="course.data.description"
						class="course-description"
					></div>

			<div class="">
				<Tabs v-model="tabIndex" :tabs="tabs" tablistClass="overflow-y-hidden">
					<template #tab="{ tab, selected }" class="overflow-x-hidden">
						<div>
							<button
								class="group -mb-px flex items-center gap-1 border-b border-transparent py-2.5 text-base text-gray-600 duration-300 ease-in-out hover:border-gray-400 hover:text-gray-900"
								:class="{ 'text-gray-900': selected }"
							>
								<component
									v-if="tab.icon"
									:is="tab.icon"
									class="h-4 stroke-1.5"
								/>
								{{ __(tab.label) }}
								<Badge
									v-if="tab.count"
									:class="{
										'text-gray-900 border border-gray-900': selected,
									}"
									variant="subtle"
									theme="gray"
									size="sm"
								>
									{{ tab.count }}
								</Badge>
							</button>
						</div>
					</template>
					<template #default="{ tab }">
						<div class="pt-5 px-5 pb-10">
							<div v-if="tab.label == 'Pelajaran'">
								<CourseOutline :courseName="course.data.name" :showOutline="true" />
							</div>
							<div v-else-if="tab.label == 'Penugasan'">
								<CourseAssignments :course="course.data.name" />
							</div>
							<div v-else-if="tab.label == 'Siswa'">
								<CourseStudents :course="course.data.name" />
							</div>
							<div v-else-if="tab.label == 'Pengumuman'">
								<CourseAnnouncements :course ="course.data.name" />
							</div>
							<div v-else-if="tab.label == 'Diskusi'">
								<Discussions
									doctype="LMS Course"
									:docname="course.data.name"
									:title="__('Diskusi')"
									:key="course.data.name"
									:singleThread="true"
									:scrollToBottom="true"
								/>
							</div>

							<!--<div v-else-if="tab.label == 'Courses'">
								<BatchCourses :batch="batch.data.name" />
							</div>
							<div v-else-if="tab.label == 'Dashboard'">
								<BatchDashboard :batch="batch" :isStudent="isStudent" />
							</div>
							<div v-else-if="tab.label == 'Live Class'">
								<LiveClass :batch="batch.data.name" />
							</div>
							<div v-else-if="tab.label == 'Students'">
								<BatchStudents :batch="batch.data.name" />
							</div>
							<div v-else-if="tab.label == 'Assessments'">
								<Assessments :batch="batch.data.name" />
							</div>
							<div v-else-if="tab.label == 'Announcements'">
								<Announcements :batch="batch.data.name" />
							</div>
							<div v-else-if="tab.label == 'Discussions'">
								<Discussions
									doctype="LMS Batch"
									:docname="batch.data.name"
									:title="__('Discussions')"
									:key="batch.data.name"
									:singleThread="true"
									:scrollToBottom="true"
								/>
							</div>-->
						</div>
					</template>
				</Tabs>
			</div>
			<CourseAnnouncementModal
				v-model="showAnnouncementModal"
				:course="course.data.name"
				:students="course.data.students"
			/>

					<!--<CourseReviews
						:courseName="course.data.name"
						:avg_rating="course.data.avg_rating"
						:membership="course.data.membership"
					/>-->
				</div>
				<div class="hidden md:block">
					<CourseCardOverlay :course="course" />
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { createResource, Breadcrumbs, Badge, Tooltip, Tabs, Button } from 'frappe-ui'
import { computed, ref, inject } from 'vue'
import { 
	Users, 
	Star, 
	Clock,
	LayoutDashboard,
	BookOpen,
	Laptop,
	BookOpenCheck,
	Contact2,
	Mail,
	SendIcon,
	MessageCircle,
	Globe,
 } from 'lucide-vue-next'
import CourseCardOverlay from '@/components/CourseCardOverlay.vue'
import CourseOutline from '@/components/CourseOutline.vue'
import CourseReviews from '@/components/CourseReviews.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { updateDocumentTitle } from '@/utils'
import CourseInstructors from '@/components/CourseInstructors.vue'
import Assessments from '@/components/Assessments.vue'
import Assignments from '@/components/Assignments.vue'
import CourseAssignments from '@/components/CourseAssignments.vue'
import BatchStudents from '@/components/BatchStudents.vue'
import CourseStudents from '@/components/CourseStudents.vue'
import Announcements from '@/components/Annoucements.vue'
import CourseAnnouncements from '@/components/CourseAnnouncements.vue'
import AnnouncementModal from '@/components/Modals/AnnouncementModal.vue'
import CourseAnnouncementModal from '@/components/Modals/CourseAnnouncementModal.vue'
import Discussions from '@/components/Discussions.vue'

const user = inject('$user')
const showAnnouncementModal = ref(false)

const props = defineProps({
	courseName: {
		type: String,
		required: true,
	},
})

const batch = createResource({
	url: 'lms.lms.utils.get_batch_details',
	cache: ['batch', "CLS-00007"],
	params: {
		batch: "CLS-00007",
	},
	auto: true,
})


const course = createResource({
	url: 'lms.lms.utils.get_course_details',
	cache: ['course', props.courseName],
	params: {
		course: props.courseName,
	},
	auto: true,
})

const breadcrumbs = computed(() => {
	let items = [{ label: 'Semua Pelajaran', route: { name: 'Courses' } }]
	items.push({
		label: course?.data?.title,
		route: { name: 'CourseDetail', params: { course: course?.data?.name } },
	})
	return items
})

const pageMeta = computed(() => {
	return {
		title: course?.data?.title,
		description: course?.data?.short_introduction,
	}
})

updateDocumentTitle(pageMeta)

const tabIndex = ref(0)
const tabs = computed(() => {
	let batchTabs = []
	batchTabs.push({
		label: 'Pelajaran',
		icon: LayoutDashboard,
	})
	// if (user.data?.is_moderator) {
		batchTabs.push({
			label: 'Penugasan',
			icon: BookOpenCheck,
		})
	// }
	// if (isStudent.value) {
	// 	batchTabs.push({
	// 		label: 'Dashboard',
	// 		icon: LayoutDashboard,
	// 	})
	// }
	// batchTabs.push({
	// 	label: 'Courses',
	// 	icon: BookOpen,
	// })
	batchTabs.push({
		label: 'Pengumuman',
		icon: Mail,
	})
	batchTabs.push({
		label: 'Diskusi',
		icon: MessageCircle,
	})
	if (user.data?.is_moderator) {
		batchTabs.push({
			label: 'Siswa',
			icon: Contact2,
		})
	}
	return batchTabs
})

const isStudent = computed(() => {
	return (
		user?.data &&
		batch.data?.students.length &&
		batch.data?.students.includes(user.data.name)
	)
})

const openAnnouncementModal = () => {
	showAnnouncementModal.value = true
}

</script>
<style>
.course-description p {
	margin-bottom: 1rem;
	line-height: 1.7;
}
.course-description li {
	line-height: 1.7;
}

.course-description ol {
	list-style: auto;
	margin: revert;
	padding: revert;
}

.course-description ul {
	list-style: disc;
	margin: revert;
	padding: revert;
}

.avatar-group {
	display: inline-flex;
	align-items: center;
}

.avatar-group .avatar {
	transition: margin 0.1s ease-in-out;
}
</style>
