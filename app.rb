require 'sinatra'
require "sinatra/reloader" if development?

get '/' do
  erb :index
end


post '/file' do
  pp params[:file]
  pp params[:preset]
  "OK, THANKS"

end
