// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BlogCard from "./BlogCard";

// const CollaborativeRecommendations = ({ userId }) => {
//   const [recommendedBlogs, setRecommendedBlogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [noRecs, setNoRecs] = useState(false);

//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       setLoading(true);
//       setNoRecs(false);
//       try {
//         const API_BASE = import.meta.env.VITE_API_BASE_URL;

//         // Step 1: Get recommended blog IDs with scores
//         const { data: recData } = await axios.get(`${API_BASE}/blog/recommend-collab`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         const recommendations = recData.recommendations || [];

//         if (recommendations.length === 0) {
//           setRecommendedBlogs([]);
//           setNoRecs(true);
//         } else {
//           const recommendedIds = recommendations.map((r) => r.blogId);
//           const scoreMap = Object.fromEntries(recommendations.map((r) => [r.blogId, r.score]));

//           // Step 2: Fetch full blog data for the IDs
//           const { data: blogsData } = await axios.get(
//             `${API_BASE}/blog/metadata?ids=${recommendedIds.join(",")}`
//           );

//           const enrichedBlogs = blogsData.map((blog) => ({
//             ...blog,
//             similarityScore: scoreMap[blog._id] || 0,
//           }));

//           // Step 3: Sort by similarityScore descending
//           enrichedBlogs.sort((a, b) => b.similarityScore - a.similarityScore);

//           setRecommendedBlogs(enrichedBlogs);
//           setNoRecs(false);
//         }
//       } catch (error) {
//         console.error("Error fetching recommendations:", error);
//         setRecommendedBlogs([]);
//         setNoRecs(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchRecommendations();
//     }
//   }, [userId]);

//   if (!userId) return null;

//   return (
//     <div>
//       <h2
//         style={{
//           fontWeight: "600",
//           marginBottom: 16,
//           borderBottom: "2px solid #10b981",
//           paddingBottom: 6,
//           color: "#10b981",
//         }}
//       >
//         🧠 You May Also Like
//       </h2>

//       {loading ? (
//         <p style={{ color: "#888", fontStyle: "italic" }}>Loading recommendations...</p>
//       ) : noRecs ? (
//         <p style={{ color: "#999", fontStyle: "italic" }}>
//           No personalized recommendations yet.
//         </p>
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(2, 1fr)",
//             gap: "20px",
//           }}
//         >
//           {recommendedBlogs.map((blog) => (
//             <div key={blog._id}>
//               <BlogCard blog={blog} currentUserId={userId} />
//               <p style={{ fontSize: "12px", color: "#666", marginTop: 4 }}>
//                 🔍 Similarity Score: {blog.similarityScore}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CollaborativeRecommendations;


import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";


const CollaborativeRecommendations = ({ userId }) => {
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noRecs, setNoRecs] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setNoRecs(false);
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL;

        // Step 1: Get recommended blog IDs with scores
        const { data: recData } = await axios.get(`${API_BASE}/blog/recommend-collab`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const recommendations = recData.recommendations || [];

        if (recommendations.length === 0) {
          setRecommendedBlogs([]);
          setNoRecs(true);
        } else {
          // Filter out recommendations with score <= 0
          const filteredRecs = recommendations.filter((r) => r.score > 0);

          if (filteredRecs.length === 0) {
            setRecommendedBlogs([]);
            setNoRecs(true);
            setLoading(false);
            return;
          }

          const recommendedIds = filteredRecs.map((r) => r.blogId);
          const scoreMap = Object.fromEntries(filteredRecs.map((r) => [r.blogId, r.score]));

          // Step 2: Fetch full blog data for the IDs
          const { data: blogsData } = await axios.get(
            `${API_BASE}/blog/metadata?ids=${recommendedIds.join(",")}`
          );

          const enrichedBlogs = blogsData.map((blog) => ({
            ...blog,
            similarityScore: scoreMap[blog._id] || 0,
          }));

          // Step 3: Sort by similarityScore descending
          enrichedBlogs.sort((a, b) => b.similarityScore - a.similarityScore);

          setRecommendedBlogs(enrichedBlogs);
          setNoRecs(false);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendedBlogs([]);
        setNoRecs(true);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);

  if (!userId) return null;

  return (
    <div>
      <h2
        style={{
          fontWeight: "600",
          marginBottom: 16,
          borderBottom: "2px solid #10b981",
          paddingBottom: 6,
          color: "#10b981",
        }}
      >
          <FontAwesomeIcon icon={faBrain} /> You May Also Like
      </h2>

      {loading ? (
        <p style={{ color: "#888", fontStyle: "italic" }}>Loading recommendations...</p>
      ) : noRecs ? (
        <p style={{ color: "#999", fontStyle: "italic" }}>
          No personalized recommendations yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {recommendedBlogs.map((blog) => (
            <div key={blog._id}>
              <BlogCard blog={blog} currentUserId={userId} />
              <p style={{ fontSize: "12px", color: "#666", marginTop: 4 }}>
                🔍 Similarity Score: {blog.similarityScore.toFixed(3)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborativeRecommendations;
