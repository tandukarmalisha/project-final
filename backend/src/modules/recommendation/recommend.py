# recommend.py
import sys
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def main():
    if len(sys.argv) < 2:
        print("No blog title provided.")
        return

    # Get title from command-line argument
    input_title = sys.argv[1].strip().lower()

    # 1. Fetch all blogs
    response = requests.get("http://localhost:8000/api/blog/all")
    data = response.json()
    blogs = data.get("blogs", [])

    if not blogs:
        print("No blogs found.")
        return

    # 2. Extract titles and content
    titles = [blog["title"] for blog in blogs]
    contents = [blog["content"] for blog in blogs]

    # 3. TF-IDF Vectorization
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(contents)

    # 4. Calculate Similarity Matrix
    similarity_matrix = cosine_similarity(tfidf_matrix)

    # 5. Find blog index matching input title
    try:
        index = next(i for i, t in enumerate(titles) if t.lower() == input_title)
    except StopIteration:
        print(f"No blog found with title '{input_title}'")
        return

    # 6. Print recommendations (stdout for Node.js to read)
    similar_indices = similarity_matrix[index].argsort()[-4:-1][::-1]  # exclude self
    for i in similar_indices:
        print(f"=> {titles[i]}")

if __name__ == "__main__":
    main()
