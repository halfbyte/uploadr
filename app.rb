require 'sinatra'
require "sinatra/reloader" if development?
require 'fileutils'
require 'mini_magick'

PRESETS = {
  '500w' => { op: '500x>', name: '500px width max' },
  '1000w' => { op: '1000x>', name: '1000px width max' }
}

BASE_URL = ENV['BASE_URL'] || 'http://localhost:4567/uploads'

set(:auth_password, ENV['UPLOADR_AUTH_PASSWORD'] || 'jan')
set(:auth_username, ENV['UPLOADR_AUTH_USERNAME'] || 'jan')

def normalize_ext(ext)
  ext.downcase.sub(/jpeg/, 'jpg')
end

use Rack::Auth::Basic, "Protected Area" do |username, password|
  username == settings.auth_username && password == settings.auth_password
end

get '/' do
  @default_preset = '500w'
  @presets = PRESETS
  erb :index
end


post '/file' do

  ext = normalize_ext(File.extname(params[:file]['filename']))

  final_filename = "#{params['filename']}#{ext}"

  image = MiniMagick::Image.read params[:file]['tempfile']

  image.resize(PRESETS[params[:preset]][:op])

  loop do
    prefix = SecureRandom.hex(10)
    new_path = File.join(settings.public_folder, 'uploads', prefix)
    if !File.exist?(new_path)
      FileUtils.mkdir_p(new_path)
      image.write(File.join(new_path, final_filename))
      return "#{BASE_URL}/#{prefix}/#{final_filename}"
    end
  end

  [500, "couldn't finish upload"]
end
