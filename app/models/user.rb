# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # set an expiration time for guest users
  scope :expired_guests, lambda { |cutoff = 1.day.ago|
    where(guest: true).where('created_at < ?', cutoff)
  }
end
