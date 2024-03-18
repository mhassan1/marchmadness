import swal from 'sweetalert2'
export const onSuccess = () => {
  return swal.fire({
    icon: 'success',
    html: `
    <img
      src="https://images.news18.com/ibnlive/uploads/2020/11/1604769947_joe-biden-donald-trump.jpg"
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
