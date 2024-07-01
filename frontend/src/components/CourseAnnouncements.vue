<template>
	<div v-if="announcement.data?.length">
		<div v-for="comm in announcement.data">
			<div class="mb-8">
				<div class="flex items-center justify-between mb-2">
					<div class="flex items-center">
						<div class="ml-2">
							{{ comm.title}}
						</div>
					</div>
					<div class="text-sm">
						{{ timeAgo(comm.creation) }}
					</div>
				</div>
				<div
					class="prose prose-sm bg-gray-50 !min-w-full px-4 py-2 rounded-md"
					v-html="comm.announcement"
				></div>
			</div>
		</div>
	</div>
	<div v-else class="text-sm italic text-gray-600">
		{{ __('Tidak Ada Pengumuman') }}
	</div>
</template>
<script setup>
import { createListResource, Avatar, createResource} from 'frappe-ui'
import { timeAgo } from '@/utils'

const props = defineProps({
	course: {
		type: String,
		required: true,
	},
})

const announcement = createResource({
	url: 'lms.lms.utils.get_course_announcements',
	cache: ['announcements', props.course],
	params: {
		batch: props.course,
	},
	auto: true,
})

const communications = createListResource({
	doctype: 'Communication',
	fields: [
		'subject',
		'content',
		'recipients',
		'cc',
		'communication_date',
		'sender',
		'sender_full_name',
	],
	filters: {
		reference_doctype: 'LMS Batch',
		reference_name: props.batch,
	},
	orderBy: 'communication_date desc',
	auto: true,
	cache: ['batch', props.batch],
})
</script>
<style>
.prose-sm p {
	margin: 0 0 0.5rem;
}
</style>
