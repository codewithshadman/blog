require 'liquid'
require 'uri'

# underscores all words of the input
module UnderscoresAll
  def underscoresall(words)
    return words.split(' ').map(&:downcase).join('_').split('-').join('_')
  end
end

Liquid::Template.register_filter(UnderscoresAll)


# underscores all words of the input
module UriLast
  def urilast(uri)
    return URI(uri).path.split('/').last
  end
end

Liquid::Template.register_filter(UriLast)
