import swal from 'sweetalert2'
export const onSuccess = () => {
  return swal.fire({
    icon: 'success',
    html: `
    <img
      src="https://assets.teenvogue.com/photos/6707bd47e9b0b1b9ba766917/16:10/w_1600,c_limit/MCDWICK_UV014.jpg"
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
