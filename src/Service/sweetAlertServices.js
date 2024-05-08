import Swal from 'sweetalert2';

const sweetAlertService = {
  success: (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  },
  error: (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  },
  warning: (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  },
  info: (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  },
  confirm: (title, text, onConfirm) => {
    Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }
};

export default sweetAlertService;
