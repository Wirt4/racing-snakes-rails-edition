# frozen_string_literal: true

def new_session_info(user_signed_in)
  # creates a SessionInfoController with appropriate user state
  session_info = SessionInfoController.new
  allow(session_info).to receive(:user_signed_in?).and_return(user_signed_in)
  session_info
end

RSpec.describe 'Session class type tests' do
  it 'confirm sessioninfo is a child of application' do
    session_info = new_session_info(true)
    expect(session_info).to be_a ApplicationController
  end
  it 'link path member links to logout' do
    session_info = new_session_info(true)
    expect(session_info.link_path).to eql('/users/sign_out')
  end
  it 'link path member links to login' do
    session_info = new_session_info(false)
    expect(session_info.link_path).to eql('/users/sign_in')
  end
  it 'link text says "Log Out" if user is signed in' do
    session_info = new_session_info(true)
    expect(session_info.link_text).to eql('Log Out')
  end
  it 'link text says "Log In/Register" if user is signed out' do
    session_info = new_session_info(false)
    expect(session_info.link_text).to eql('Log In/Register')
  end
end
