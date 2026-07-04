export async function onRequestGet(context: any) {
  const db = context.env.ARASH_DB;
  
  let scores = await db.get('leaderboard', 'json');
  if (!scores) {
    scores = [
      { name: 'TenZ', score: 42 },
      { name: 'Shroud', score: 38 },
      { name: 'ArashYT', score: 35 }
    ];
    await db.put('leaderboard', JSON.stringify(scores));
  }
  
  // Sort descending
  scores.sort((a: any, b: any) => b.score - a.score);
  
  return new Response(JSON.stringify(scores.slice(0, 10)), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context: any) {
  const db = context.env.ARASH_DB;
  
  try {
    const { name, score } = await context.request.json();
    let scores = await db.get('leaderboard', 'json') || [];
    
    scores.push({ name, score });
    scores.sort((a: any, b: any) => b.score - a.score);
    
    // Keep top 50
    scores = scores.slice(0, 50);
    
    await db.put('leaderboard', JSON.stringify(scores));
    return new Response(JSON.stringify({ success: true, scores: scores.slice(0, 10) }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
