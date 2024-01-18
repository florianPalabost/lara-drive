<script setup>
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import SecondaryButton from "@/Components/SecondaryButton.vue";
import TextInput from "@/Components/TextInput.vue";
import { useForm } from "@inertiajs/vue3";
import { nextTick, ref } from "vue";

const props = defineProps(["folder"]);

const confirmingUserDeletion = ref(false);
const passwordInput = ref(null);

const form = useForm({
    name: "",
    path: "",
    folder_id: null,
    file: null,
});

const addFile = () => {
    // debugger;
    const folderPath =
        props.folder && props.folder.path ? props.folder.path : "";
    form.path = folderPath + "/" + form.name;

    if (props.folder) {
        form.folder_id = props.folder.id;
    }

    form.post(route("folders.files.store", { id: props.folder.id }), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value.focus(),
        onFinish: () => form.reset(),
    });
};

const closeModal = () => {
    confirmingUserDeletion.value = false;

    form.reset();
};
</script>

<template>
    <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900">Add File</h2>

        <div class="mt-6">
            <InputLabel for="name" value="Name" class="sr-only" />

            <TextInput
                id="name"
                ref="nameInput"
                v-model="form.name"
                type="text"
                class="mt-1 block w-3/4"
                placeholder="name"
                @keyup.enter="addFile"
            />

            <TextInput
                id="path"
                ref="pathInput"
                v-model="form.path"
                type="hidden"
                class="mt-1 block w-3/4"
                placeholder="path"
            />

            <input
                type="file"
                class="mt-4 block w-3/4"
                @input="form.file = $event.target.files[0]"
            />
            <progress
                v-if="form.progress"
                :value="form.progress.percentage"
                max="100"
            >
                {{ form.progress.percentage }}%
            </progress>

            <InputError :message="form.errors.name" class="mt-2" />
        </div>

        <div class="mt-8 flex justify-end">
            <SecondaryButton @click="closeModal"> Cancel </SecondaryButton>

            <PrimaryButton
                class="ms-3"
                :class="{ 'opacity-25': form.processing }"
                :disabled="form.processing"
                @click="addFile"
            >
                Add
            </PrimaryButton>
        </div>
    </div>
</template>
