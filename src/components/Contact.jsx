import Card from './ui/Card';

const Contact = () => {
  return (
    <div className="min-h-[88vh] bg-bg-primary flex items-center justify-center px-4">
      <Card variant="elevated" padding="xl" className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-6">
          <span className="text-3xl" aria-hidden="true">📧</span>
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-4">Contact Us</h1>
        <p className="text-text-secondary mb-6">
          If you want to remove your data, please contact us at:
        </p>

        <a
          href="mailto:healthbridge.main@gmail.com"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
        >
          📧 healthbridge.main@gmail.com
        </a>
      </Card>
    </div>
  );
};

export default Contact;
  