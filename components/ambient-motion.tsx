/** Decorative, non-interactive motion shared by the login and workspace. */
export default function AmbientMotion({variant = 'workspace'}: {variant?: 'login' | 'form' | 'workspace'}) {
  return <div className={`ambient-motion ambient-${variant}`} aria-hidden="true">
    <span className="ambient-track ambient-track-one"/>
    <span className="ambient-track ambient-track-two"/>
    <span className="ambient-orb ambient-orb-one"/>
    <span className="ambient-orb ambient-orb-two"/>
    <span className="ambient-orb ambient-orb-three"/>
    <span className="ambient-spark ambient-spark-one"/>
    <span className="ambient-spark ambient-spark-two"/>
    <span className="ambient-spark ambient-spark-three"/>
    <span className="ambient-spark ambient-spark-four"/>
    <span className="ambient-spark ambient-spark-five"/>
  </div>;
}
