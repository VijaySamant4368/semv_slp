import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importing the CSS file for styling

// Utility functions to trigger different types of toasts
const showToast = (message, type = "success") => {
  switch (type) {
    case "success":
      toast.success(message, { position: "top-right" });
      break;
    case "error":
      toast.error(message, { position: "top-right" });
      break;
    case "info":
      toast.info(message, { position: "top-right" });
      break;
    case "warning":
      toast.warning(message, { position: "top-right" });
      break;
    default:
      toast(message, { position: "top-right" });
  }
};

// Toast Component that will render ToastContainer
const Toast = () => {
  return (
    <>
      <ToastContainer
        position="top-right" // Positioning of the toast container
        autoClose={5000} // Toast auto-close time in milliseconds
        hideProgressBar={false} // Whether to show the progress bar
        newestOnTop={false} // If true, newest toast will be shown on top
        closeOnClick={true} // Whether the toast closes when clicked
        rtl={false} // Enable/Disable right-to-left positioning
        pauseOnFocusLoss={false} // Whether the toast pauses when window is out of focus
        draggable={false} // Whether the toast can be dragged
        pauseOnHover={false} // Whether the toast pauses on hover
      />
    </>
  );
};

// Export the Toast component and showToast utility functions
export { Toast, showToast };
