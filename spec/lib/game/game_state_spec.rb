# frozen_string_literal: true

require_relative '../../../app/lib/racing_snakes'
RSpec.describe RacingSnakes::Game do
  let(:mock_roster) { instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil, count: 3, active_players: 3) }
  let(:mock_board) { instance_double(RacingSnakes::AbstractBoard, collisions: nil) }
  let(:game) { described_class.new(player_roster: mock_roster, board: mock_board) }
  it 'game is just created' do
    allow(mock_roster).to receive(:count).and_return(0)
    allow(mock_roster).to receive(:state).and_return({})
    game = described_class.new(player_roster: mock_roster, board: mock_board)
    expected = { 'waiting_for_players': true, 'game_over': false, 'players': {} }
    expect(game.state).to eq(expected)
  end
  it 'game is over' do
    allow(mock_roster).to receive(:count).and_return(1)
    allow(mock_roster).to receive(:state).and_return({
        'winning_player':{
          'status': 'winner', 
          'location':[50, 50],
          'heading':0,
          'trail':[[],[],[]]
        } ,
        'losing_player':{
          'status': 'deatviated',
        }}
)

    game = described_class.new(player_roster: mock_roster, board: mock_board)
    expected = { 
      'waiting_for_players': false, 
      'game_over': true, 
      'players': {
        'winning_player':{
          'status': 'winner', 
          'location':[50, 50],
          'heading':0,
          'trail':[[],[],[]]
        } ,
        'losing_player':{
          'status': 'deatviated',
        }
      }
    expect(game.state).to eq(expected)
  end
end
