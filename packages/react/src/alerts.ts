import swal from 'sweetalert2'
export const onSuccess = () => {
  return swal.fire({
    icon: 'success',
    html: `
    <img
      src="https://img.freepik.com/free-vector/basketball-player-design-against-coronavirus_123847-293.jpg?w=360"
      style="animation:wiggle 1s infinite; width: 50%;"
    />
    `,
    customClass: {
      htmlContainer: 'wiggle-container',
    },
  })
}
export const onFailure = () => {
  return swal.fire({
    icon: 'error',
    text: 'Error!',
  })
}
