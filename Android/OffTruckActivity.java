package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RoundRectShape;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import com.google.firebase.auth.FirebaseAuth;


public class OffTruckActivity extends AppCompatActivity {

    private String uid;
    private String username;
    Context context;
    Button aButton;
    Button bButton;
    Button cButton;
    Button dButton;
    //ImageButton logoutButton;
    public static final String UID_SAVE = "UIDSaveFile";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_off_truck);
        context=this;
        TextView mTextView=(TextView) findViewById(R.id.usernameTextView);
        //username = getIntent().getStringExtra("USER_NAME");
        //uid = getIntent().getStringExtra("USER_ID");
        SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        uid=uidSave.getString("pUID", null);
        username=uidSave.getString("pUsername", null);
        mTextView.setText(username);
    }

    @Override
    protected void onResume(){
        super.onResume();
        TextView mTextView=(TextView) findViewById(R.id.usernameTextView);
        SharedPreferences save = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        if(uid == null || uid.isEmpty()) {
            uid = save.getString("pUID", null);
            username = save.getString("pUsername", null);
        }
        mTextView.setText(username);
    }

    public void onStretcher(View view)
    {
        Intent intent = new Intent(OffTruckActivity.this, StretchersActivity.class);
        intent.putExtra("USER_NAME", username);
        intent.putExtra("USER_ID", uid);
        startActivity(intent);
    }

    public void onLadder(View view)
    {
        Intent intent = new Intent(OffTruckActivity.this, LaddersActivity.class);
        intent.putExtra("USER_NAME", username);
        intent.putExtra("USER_ID", uid);
        startActivity(intent);
    }

    public void onSCBA(View view)
    {
        Intent intent = new Intent(OffTruckActivity.this, SCBAActivity.class);
        intent.putExtra("USER_NAME", username);
        intent.putExtra("USER_ID", uid);
        startActivity(intent);
    }

    public void onMisc(View view)
    {
        Intent intent = new Intent(OffTruckActivity.this, MiscActivity.class);
        intent.putExtra("USER_NAME", username);
        intent.putExtra("USER_ID", uid);
        startActivity(intent);
    }

    @Override
    public boolean onNavigateUp(){

        return false;
    }
}
