/* eslint-disable react/prop-types */
const HyphenToSpaceConverter = ({ inputString }) => {
  // Remove hyphens and replace them with spaces
  const convertedString = inputString.replace(/-/g, " ");

  return (
    <div>
      <p>{convertedString}</p>
    </div>
  );
};

export default HyphenToSpaceConverter;
