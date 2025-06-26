



# # recommend.py
# import sys
# import requests
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# import json

# def main():
#     if len(sys.argv) < 2:
#         print("No input provided")
#         return

#     query = sys.argv[1].strip().lower()

#     # Fetch all blogs
#     response = requests.get("http://localhost:8000/api/blog/recommendation-data")
#     data = response.json()
#     blogs = data.get("blogs", [])

#     if not blogs:
#         print("No blogs found.")
#         return

#     titles = [blog.get("title", "") for blog in blogs]
#     contents = [blog.get("content", "") for blog in blogs]
#     combined = [t + " " + c for t, c in zip(titles, contents)]

#     vectorizer = TfidfVectorizer(stop_words="english")
#     tfidf_matrix = vectorizer.fit_transform(combined)

#     query_vec = vectorizer.transform([query])
#     similarity_scores = cosine_similarity(query_vec, tfidf_matrix).flatten()

#     top_indices = similarity_scores.argsort()[-3:][::-1]

#     results = []
#     for i in top_indices:
#         blog = blogs[i]
#         author = blog.get("author") or {}  # Safely fallback to empty dict

#         results.append({
#             "_id": blog.get("_id"),
#             "title": blog.get("title"),
#             "content": blog.get("content"),
#             "image": blog.get("image"),
#             "categories": blog.get("categories", []),
#             "author": {
#                 "_id": author.get("_id"),
#                 "name": author.get("name", "Unknown")
#             }
#         })

#     print(json.dumps({"recommendations": results}))

# if __name__ == "__main__":
#     main()
import sys
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

def main():
    if len(sys.argv) < 2:
        print("No input provided")
        return

    query = sys.argv[1].strip().lower()

    # Fetch all blogs
    response = requests.get("http://localhost:8000/api/blog/recommendation-data")
    data = response.json()
    blogs = data.get("blogs", [])

    if not blogs:
        print("No blogs found.")
        return

    titles = [blog.get("title", "") for blog in blogs]
    contents = [blog.get("content", "") for blog in blogs]
    combined = [t + " " + c for t, c in zip(titles, contents)]

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(combined)

    query_vec = vectorizer.transform([query])
    similarity_scores = cosine_similarity(query_vec, tfidf_matrix).flatten()

    # Set a threshold to only include relevant matches
    threshold = 0.1

    # Combine blogs with their similarity scores
    blog_scores = [
        (score, blog) for score, blog in zip(similarity_scores, blogs) if score >= threshold
    ]

    # Sort by similarity descending
    blog_scores.sort(reverse=True, key=lambda x: x[0])

    # Extract sorted blog results
    results = []
    for score, blog in blog_scores:
        author = blog.get("author") or {}
        results.append({
            "_id": blog.get("_id"),
            "title": blog.get("title"),
            "content": blog.get("content"),
            "image": blog.get("image"),
            "categories": blog.get("categories", []),
            "author": {
                "_id": author.get("_id"),
                "name": author.get("name", "Unknown")
            }
        })

    print(json.dumps({"recommendations": results}))

if __name__ == "__main__":
    main()
