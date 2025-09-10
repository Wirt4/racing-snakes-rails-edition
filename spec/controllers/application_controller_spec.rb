require 'rails_helper'

RSpec.describe ApplicationController, type: :controller do
  # mock an anonymous controller
  controller do
    def index
      render plain: 'OK'
    end
  end
  # context: when user is logged in
  # mock the user
  let(:user) { User.create!(password: 'foobarbar', email: 'test@example.com') }

  context 'when user is logged in' do
    # fake a signed in user for next test
    before do
      allow(controller).to receive(:current_user).and_return(user)
    end

    it 'returns the logged-in user' do
      expect(controller.current_user).to eq(user)
    end
  end

  context 'user is not logged in' do
    # no current user mocked here, user is logged out
    it 'if not logged in, then creates guest user' do
      # know it's creating a guest user
      expect do
        controller.send(:current_user)
      end.to change(User, :count).by(1)
    end
  end
end
