const Contact = () => {
    return (
      <div className="flex items-center justify-center">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-6">
          If you want to remove your data, please contact us at:
          </p>
          <a 
            href="mailto:contact@example.com"
            className="text-blue-600 hover:underline"
          >
            📧 healthbridge.main@gmail.com
          </a>
        </div>
      </div>
    );
  };
  
  export default Contact;
  