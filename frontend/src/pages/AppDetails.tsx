import React, { useEffect, useState } from 'react';
import { getAppFeedback, postFeedback } from '../api/api';
import { useParams } from 'react-router-dom';

export default function AppDetails() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState([]);
  const [thumbsUp, setThumbsUp] = useState(true);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (id) {
      getAppFeedback(id).then(res => setFeedback(res.data));
    }
  }, [id]);

  const submit = () => {
    if (id) {
      postFeedback({ app_id: id, thumbs_up: thumbsUp, comment }).then(() =>
        getAppFeedback(id).then(res => setFeedback(res.data))
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-2">Feedback</h1>
      <div className="mb-2">
        <textarea value={comment} onChange={e => setComment(e.target.value)} />
        <br />
        <label>
          <input
            type="checkbox"
            checked={thumbsUp}
            onChange={() => setThumbsUp(!thumbsUp)}
          />
          Thumbs Up
        </label>
        <br />
        <button onClick={submit}>Submit Feedback</button>
      </div>
      <ul>
        {feedback.map((fb, i) => (
          <li key={i}>
            {fb.thumbs_up ? '👍' : '👎'} {fb.comment}
          </li>
        ))}
      </ul>
    </div>
  );
}