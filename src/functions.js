import Swal from 'sweetalert2';
import { nextTick } from '@vue/runtime-core';
import { useAuthStore } from '@/stores/auth'
import axios from 'axios';

export function show_alerta(msj, icon, focus) {
    if (focus !== '') {
        nextTick(() => focus.value.focus());
    }
    Swal.fire({
        title: msj, icon: icon, buttonsStyling: true
    });
}

export function confirmation(name, url, redirect) {
    const alert = Swal.mixin({ buttonsStyling: true });
    alert.fire({
        title: 'Are you sure you want to delete "' + name + '" ?',
        icon: 'question', showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Yes, delete',
        cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            sendRequest('DELETE', {}, url, redirect);
        }
    });

}
export async function sendRequest(method, params, url, redirect = '') {
    const authStore = useAuthStore();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;
    let res;
    await axios({ method: method, url: url, data: params }).then(
        response => {
            res = response.data.status,
                show_alerta(response.data.message, 'success', ''),
                setTimeout(
                    () => (redirect !== '') ? window.location.href = redirect : ''
                    , 2000)
        }).catch((errors) => {
            let desc = '';
            res = errors.response.data.status;
            errors.response.data.errors.map((e) => { desc = desc + ' ' + e })
            show_alerta(desc, 'error', '')
        })
    return res;
}

export function visible(name, url, redirect, hide) {
    const alert = Swal.mixin({ buttonsStyling: true });

    axios.get(url).then(response => {

        const newHideValue = (hide === 'n') ? 's' : 'n';

        alert.fire({
            title: 'Are you sure you want to switch the visibility of "' + name + '" ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Yes, switch',
            cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancel'

        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(url, { name: name, hide: newHideValue })
                    .then(() => {
                        window.location.href = redirect;
                    })
                    .catch((error) => {
                        console.error('Error al cambiar la visibilidad:', error);
                    });
            }
        });
    });
}
