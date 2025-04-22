const GenericStatusBadge = ({ status }) => {
  const isActive = Number(status) === 1;
  const statusText = isActive ? 'Active' : 'Inactive';
  const bgColor = isActive ? 'bg-green-100' : 'bg-red-100';
  const textColor = isActive ? 'text-green-800' : 'text-red-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {statusText}
    </span>
  );
};

export default GenericStatusBadge;
