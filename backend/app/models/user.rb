class User < ApplicationRecord
  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: /\A([\w+-]\.?)+@[a-z\d-]+(\.[a-z]+)*\.[a-z]+\z/, message: I18n.t('errors.models.user.format_email') }

  has_many :posts
  has_many :comments
  has_many :user_votes
end
