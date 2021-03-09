import swal from 'sweetalert2'
export const onSuccess = () => {
  return swal.fire({
    type: 'success',
    imageUrl:
      'https://media.tenor.com/images/9cac6e1952a73dd3188516012b513782/tenor.gif',
  })
}
export const onFailure = () => {
  return swal.fire({
    type: 'error',
    text: 'Error!',
  })
}
