import swal from 'sweetalert2'
export const onSuccess = () => {
  return swal.fire({
    icon: 'success',
    html: `
    <img
      src="https://custom-doodle.com/wp-content/uploads/doodle/auto-draft/funny-robot-dancing-doodle.gif"
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
