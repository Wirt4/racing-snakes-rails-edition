require 'rails_helper'

RSpec.describe ApplicationController, type: :controller do
  # mock an anonymous controller
  controller do
    def index
      render plain: 'OK'
    end
  end
  # mock the user
  let(:user) { User.create!(password: 'foobarbar', email: 'test@example.com') }
  # fake a signed in user for next test
  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  it 'returns the logged-in user' do
    expect(controller.current_user).to eq(user)
  end
end
