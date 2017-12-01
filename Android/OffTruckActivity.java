package comtelekpsi.github.oviedofireandroid;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RoundRectShape;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.AppCompatButton;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import com.google.firebase.auth.FirebaseAuth;

import java.util.Timer;
import java.util.TimerTask;


public class OffTruckActivity extends AppCompatActivity {

    private String uid;
    private String username;
    Context context;
    AppCompatButton aButton;
    AppCompatButton bButton;
    AppCompatButton cButton;
    AppCompatButton dButton;
    //ImageButton logoutButton;
    public static final String UID_SAVE = "UIDSaveFile";
    boolean isTablet;
    private Timer timer;
    private boolean timerFlag;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_off_truck);
        Resources res = getResources();
        isTablet=res.getBoolean(R.bool.isTablet);
        context=this;

        TextView mTextView=(TextView) findViewById(R.id.usernameTextView);
        //username = getIntent().getStringExtra("USER_NAME");
        //uid = getIntent().getStringExtra("USER_ID");
        final SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        uid=uidSave.getString("pUID", null);
        username=uidSave.getString("pUsername", null);
        mTextView.setText(username);
        timerFlag=true;
        aButton=(AppCompatButton) findViewById(R.id.stretchersButton);
        if(isTablet)aButton.setTextSize(40);
        aButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                timerFlag=false;
                Intent intent = new Intent(OffTruckActivity.this, StretchersActivity.class);
                intent.putExtra("USER_NAME", username);
                intent.putExtra("USER_ID", uid);
                startActivity(intent);
            }
        });
        bButton=(AppCompatButton) findViewById(R.id.laddersButton);
        if(isTablet)bButton.setTextSize(40);
        bButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                timerFlag=false;
                Intent intent = new Intent(OffTruckActivity.this, LaddersActivity.class);
                intent.putExtra("USER_NAME", username);
                intent.putExtra("USER_ID", uid);
                startActivity(intent);
            }
        });
        cButton=(AppCompatButton) findViewById(R.id.SCBAButton);
        if(isTablet)cButton.setTextSize(40);
        cButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                timerFlag=false;
                Intent intent = new Intent(OffTruckActivity.this, SCBAActivity.class);
                intent.putExtra("USER_NAME", username);
                intent.putExtra("USER_ID", uid);
                startActivity(intent);
            }
        });
        dButton=(AppCompatButton) findViewById(R.id.miscButton);
        if(isTablet)dButton.setTextSize(40);
        dButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                timerFlag=false;
                Intent intent = new Intent(OffTruckActivity.this, MiscActivity.class);
                intent.putExtra("USER_NAME", username);
                intent.putExtra("USER_ID", uid);
                startActivity(intent);
            }
        });
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
        if (timer != null) {
            timer.cancel();
            Log.i("Main", "cancel timer");
            timer = null;
        }
    }
/*
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
*/
    @Override
    public boolean onNavigateUp(){

        return false;
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (timerFlag) {
            timer = new Timer();
            Log.i("Main", "Invoking logout timer");
            LogOutTimerTask logoutTimeTask = new LogOutTimerTask();
            timer.schedule(logoutTimeTask, 10800000); //auto logout in 180 minutes
        }
    }


    private class LogOutTimerTask extends TimerTask {

        @Override
        public void run() {

            //logout
            final SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
            FirebaseAuth.getInstance().signOut();
            SharedPreferences.Editor editor = uidSave.edit();
            editor.clear();
            editor.commit();

            //redirect user to login screen
            Intent i = new Intent(OffTruckActivity.this, MainActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
            finish();
        }
    }
}
