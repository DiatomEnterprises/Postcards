set :stage, :production
set :branch, ENV.fetch('BRANCH', 'master')
 
set :user, 'root'
set :deploy_to, "/home/#{fetch(:user)}/postcards/production"
 
role :app, %w{root@178.62.224.143}
role :web, %w{root@178.62.224.143}
role :db, %w{root@178.62.224.143}
 
server '178.62.224.143', user: "#{fetch(:user)}",roles: %w{web app}
set :rvm_ruby_version, '2.2.1'