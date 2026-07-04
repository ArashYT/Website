export async function onRequestGet(context: any) {
  const db = context.env.ARASH_DB;
  
  let polls = await db.get('polls', 'json');
  if (!polls) {
    polls = {
      question: "What game should I play on the next stream?",
      options: [
        { id: 1, text: "Valorant Ranked (Immortal Push)", votes: 145 },
        { id: 2, text: "Minecraft Hardcore", votes: 89 },
        { id: 3, text: "Elden Ring DLC", votes: 210 },
        { id: 4, text: "Just Chatting / Setup Review", votes: 55 }
      ]
    };
    await db.put('polls', JSON.stringify(polls));
  }
  
  return new Response(JSON.stringify(polls), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context: any) {
  const db = context.env.ARASH_DB;
  
  try {
    const { optionId } = await context.request.json();
    let polls = await db.get('polls', 'json');
    
    if (polls) {
      const option = polls.options.find((o: any) => o.id === optionId);
      if (option) {
        option.votes += 1;
        await db.put('polls', JSON.stringify(polls));
        return new Response(JSON.stringify({ success: true, polls }), { headers: { 'Content-Type': 'application/json' } });
      }
    }
    
    return new Response(JSON.stringify({ error: 'Option not found' }), { status: 400 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
