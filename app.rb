require 'sinatra/base'

class Petrified < Sinatra::Base

  set :static, true
  set :public, File.join(File.dirname(__FILE__), 'public')
  
  get '/' do
    [200, {"Content-Type" => "text/html"}, File.open('public/index.html')]
  end

end

