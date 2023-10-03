<template>
    <div class="row mt-5">
        <div class="col-md-4 offset-md-4">
            <div class="card border border-success">
                <div class="card-header bg-success border border-success"></div>
                <div class="card-body">
                    <form @submit.prevent="save">
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-user"></i>
                            </span>
                            <input autofocus type="text" v-model="form.name" placeholder="Name" class="form-control"
                                required ref="nameInput" />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-at"></i>
                            </span>
                            <input required type="email" v-model="form.email" placeholder="Email" class="form-control" />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-phone"></i>
                            </span>
                            <input required type="text" v-model="form.phone" placeholder="Phone" class="form-control" />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-building"></i>
                            </span>
                            <select v-model="form.department_id">
                                <option disabled value="">Please select one</option>
                                <option v-for="department in departments" :value="department.id">{{ department.name }}
                                </option>
                            </select>
                        </div>
                        <div class="d-grid col-10 mx-auto">
                            <button class="btn btn-success">
                                <i class="fa-solid fa-save"></i> Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import axios from 'axios';

const nameInput = ref('');
const departments = ref([]);
const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

onMounted(async () => {
    try {
        const response = await axios.get('/api/departments');
        departments.value = response.data;
    } catch (error) {
        console.error('Error al obtener la lista de departamentos:', error);
    }
});

const form = ref({ name: '', email: '', phone: '', department_id: '' });

const save = () => {
    sendRequest('POST', form.value, '/api/employees', '');
    form.value.name = '';
    form.value.email = '';
    form.value.phone = '';
    form.value.department_id = '';
    nextTick(() => nameInput.value.focus());
};
</script>
  