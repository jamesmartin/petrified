require 'sinatra/base'

class Petrified < Sinatra::Base
  
  get '/' do
    'Petrified!'
  end

end

