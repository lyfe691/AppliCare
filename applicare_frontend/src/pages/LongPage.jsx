import { Link } from "react-router-dom";

// ! This is temporary.
function LongPage() {
    return (
      <div style={{display:"flex", padding: '2rem', flexDirection:"column", margin: "0 auto", padding: "10px" }}>
        <img src="" height="100px" alt="temp" />
        <Link to="/"><button>Back</button></Link>
        <p>
          {`lorem ipsum`.repeat(10000)}
        </p>
      </div>
    );
  }
  
  export default LongPage;
  