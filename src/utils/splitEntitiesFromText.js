const { parse } = require('twemoji-parser');

/*
 * Split Text
 * ex) 
 *  '君👼の味方🤝だよ'
 *  > ['君', TwemojiObj(👼), 'の味方', TwemojiObj(🤝), 'だよ']
 */

const discordEmojiPattern = "<a?:\\w+:(\\d{17}|\\d{18})>";

function parseDiscordEmojis(textEntities) {
	const newArray = [];
	
	for (const entity of textEntities) {
		if (typeof entity === "string") {
			const words = entity.replace(new RegExp(discordEmojiPattern, "g"), "\u200b$&\u200b").split("\u200b");
			
			words.map(word => word.match(new RegExp(discordEmojiPattern))
				? newArray.push({ url: `https://cdn.discordapp.com/emojis/${word.match(new RegExp(discordEmojiPattern))[1]}.png` })
				: newArray.push(word)
			);
		}
		
		else newArray.push(entity);
	}
	
	return newArray;
}

module.exports = function splitEntitiesFromText (text) {
  const twemojiEntities = parse(text, { assetType: 'svg' });

  let unparsedText = text;
  let lastTwemojiIndice = 0;
  const textEntities = [];
  
  twemojiEntities.forEach((twemoji) => {
    textEntities.push(
      unparsedText.slice(0, twemoji.indices[0] - lastTwemojiIndice)
    );

    textEntities.push(twemoji);

    unparsedText = unparsedText.slice(twemoji.indices[1] - lastTwemojiIndice);
    lastTwemojiIndice = twemoji.indices[1];
  });

  textEntities.push(unparsedText);

  return parseDiscordEmojis(textEntities);
}
