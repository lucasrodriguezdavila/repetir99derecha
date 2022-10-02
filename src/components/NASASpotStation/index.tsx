interface Props {
  visible?: boolean;
}
export const NASASpotStation: React.FC<Props> = ({ visible = true }) => {
  if (!visible) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "inline-block",
          border: "1px solid #CCC",
          borderRadius: "6px",
          WebkitBorderRadius: "6px",
          //@ts-ignore
          "o-border-radius": "6px",
          position: "relative",
          overflow: "hidden",
          width: "310px",
          height: "450px",
        }}
      >
        <iframe
          title="ISS Oberservation"
          src="https://spotthestation.nasa.gov/widget/widget2.cfm?theme=2"
          width={310}
          height={450}
          frameBorder={0}
        />
      </div>
    </div>
  );
};
