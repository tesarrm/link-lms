<template>
	<Dialog
		v-model="show"
		:options="{
			title: __('Buat Pengumuman'),
			size: 'xl',
			actions: [
				{
					label: 'Kirim',
					variant: 'solid',
					onClick: (close) => createAnnouncement(close),
				},
			],
		}"
	>
		<template #body-content>
			<div class="flex flex-col gap-4">
				<div class="">
					<div class="mb-1.5 text-sm text-gray-600">
						{{ __('Judul') }}
					</div>
					<Input type="text" v-model="announcement.title" />
				</div>
				<div class="mb-4">
					<div class="mb-1.5 text-sm text-gray-600">
						{{ __('Pengumuman') }}
					</div>
					<TextEditor
						:bubbleMenu="true"
						@change="(val) => (announcement.announcement = val)"
						editorClass="prose-sm py-2 px-2 min-h-[200px] border-gray-300 hover:border-gray-400 rounded-md bg-gray-200"
					/>
				</div>
			</div>
		</template>
	</Dialog>
</template>
<script setup>
import { Dialog, Input, TextEditor, createResource } from 'frappe-ui'
import { reactive } from 'vue'
import { createToast } from '@/utils/'

const show = defineModel()

const props = defineProps({
	course: {
		type: String,
		required: true,
	},
	students: {
		type: Array,
		required: true,
	},
})

const announResource = createResource({
	url: 'frappe.client.insert',
	makeParams(values) {
		return {
			doc: {
				doctype: 'LMS Course Announcement',
				parent: props.course,
				parenttype: 'LMS Course',
				parentfield: 'announcements',
				announcement: announcement.announcement,
				title : announcement.title,
			},
		}
	},
})

const createAnnouncement = (close) => {
	announResource.submit(
		{},
		{
			validate() {
				if (!props.students.length) {
					return 'Tidak ada siswa di pelajaran ini'
				}
			},
			onSuccess() {
				close()
				createToast({
					title: 'Success',
					text: 'Pengumuman telah di buat',
					icon: 'Check',
					iconClasses: 'bg-green-600 text-white rounded-md p-px',
				})
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

const announcement = reactive({
	title: '',
	subject: '',
	announcement: '',
})

const announcementResource = createResource({
	url: 'frappe.core.doctype.communication.email.make',
	makeParams(values) {
		return {
			recipients: props.students.join(', '),
			cc: announcement.replyTo,
			subject: announcement.subject,
			content: announcement.announcement,
			doctype: 'LMS Batch',
			name: props.batch,
			send_email: 1,
		}
	},
})

const makeAnnouncement = (close) => {
	announcementResource.submit(
		{},
		{
			validate() {
				if (!props.students.length) {
					return 'Tidak ada siswa di pelajaran ini'
				}
				if (!announcement.subject) {
					return 'Subjek tidak boleh kosong'
				}
			},
			onSuccess() {
				close()
				createToast({
					title: 'Success',
					text: 'Pengumuman telah di buat',
					icon: 'Check',
					iconClasses: 'bg-green-600 text-white rounded-md p-px',
				})
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
</script>
