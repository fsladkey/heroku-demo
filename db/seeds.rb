# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
User.destroy_all

User.create(email: 'fred@fred.com', password: "password")

10.times do
  email = Faker::Internet.email
  User.create(email: email, password: "password")
end

30.times do
  Post.create(title: Faker::Hacker.say_something_smart, user_id: User.ids.sample)
end
