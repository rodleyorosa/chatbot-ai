export const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export const formatTextWithBold = (text: string): React.ReactNode => {
  return text.split("\n").map((line, lineIndex) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);

    const formattedLine = parts.map((part, partIndex) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={`${lineIndex}-${partIndex}`} className="font-semibold">
            {boldText}
          </strong>
        );
      }
      return part;
    });

    return (
      <span key={lineIndex}>
        {formattedLine}
        {lineIndex < text.split("\n").length - 1 && <br />}
      </span>
    );
  });
};
