# frozen_string_literal: true

require_relative '../../../app/lib/racing_snakes'
RSpec.describe RacingSnakes::Game do
  let(:mock_roster) { instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil, count: 3, active_players: 3) }
  let(:mock_board) { instance_double(RacingSnakes::AbstractBoard, collisions: nil) }
  let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }
  it 'game is just created' do
    expected = { 'waiting_for_players': false }
    expect(game.state).to eq(expected)
  end
end
