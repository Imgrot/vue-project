<script setup>
import axios from 'axios';
import { ref, onMounted, nextTick } from 'vue';
import { confirmation, sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import Paginate from 'vuejs-paginate-next';
const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

onMounted(() => { getDepartments(), getEmployees(1) });
const departments = ref([]);
const employees = ref([]);
const load = ref(false);
const rows = ref(0); 

const getDepartments = async () => {
    await axios.get('/api/departments').then(
        response => (departments.value = response.data)
    );
}

const getEmployees = async (page) => {
    await axios.get('/api/employees?page=' + page).then(
        response => (
            employees.value = response.data,
            rows.value = response.data.last_page
        )
    );
    load.value = true;
}

const deleteEmployee = (id, name) => {
    confirmation(name, ('/api/employees/' + id), '/employees');
}

</script>

<template>
    <div class="row">
        <div class="col-md-4 offset-md-4">
            <div class="d-grid col-10 mx-auto">
                <router-link :to="{ path: 'registerClient' }" class="btn btn-dark">
                    <i class="fa-solid fa-circle-plus"></i>Add
                </router-link>

            </div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-10 offset-md-1">
            <div class="card border border-white text-center" v-if="!load">
                <div class="card-body">
                    <img src="/loading.gif" class="img-fluid">
                </div>
            </div>
            <div class="table-responsive" v-else>
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>PHONE</th>
                            <th>DEPARTMENT</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="emp, i in employees.data" :key="emp.id">
                            <td>{{ (i + 1) }}</td>
                            <td>{{ emp.name }}</td>
                            <td>{{ emp.email }}</td>
                            <td>{{ emp.phone }}</td>
                            <td>{{ emp.department }}</td>
                            <td>
                                <router-link :to="{ path: 'editEmployee/' + emp.id }" class="btn btn-dark">
                                    <i class="fa-solid fa-edit"></i>
                                </router-link>
                            </td>
                            <td>
                                <button class="btn btn-danger" @click="deleteEmployee(emp.id, emp.name)">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Paginate :page-count="rows" :click-handler="getEmployees" :prev-text="'Prev'" :next-text="'Next'"
                    :container-class="'pagination'">
                </Paginate>
            </div>
        </div>
    </div>
</template>