<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import axios from 'axios';

const route = useRoute();
const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const alert = Swal.mixin({ buttonsStyling: true });
const form = ref({ id: '', name: '', email: '', phone: '', department_id: '', hide: '' });
const id = ref(route.params.id);
const departments = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get('/api/departments');
        departments.value = response.data;

        const response2 = await axios.get('api/employees/' + id.value);
        form.value = response2.data.data;

    } catch (error) {
        console.error('Error al obtener la lista de departamentos:', error);
    }
});

const save = () => {
    const largo = form.value.phone;
    if (largo.length > 15) {
        alert.fire({
            title: 'The limit of digits on "phone" is 15.',
            html: 'Please re-enter the phone number.',
            confirmButtonText: '<i class="fa-solid fa-check"></i> Ok',
        });
    } else {
        sendRequest('PUT', form.value, ('/api/employees/' + id.value), '/employees');
    }
}
</script>

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
                                <template v-for="department in departments">
                                    <option v-if="department.hide == 'n'" :value="department.id">
                                        {{ department.name }}
                                    </option>
                                </template>
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